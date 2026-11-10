// Whether a rule's Command only reads (AGENTS.md, "Rule IDs"). Agents run a Command with `sh -c` in an app's
// repository, from a file they downloaded, so it may not write a file, start a program of its choosing or reach the
// network. A list of forbidden programs can't hold that (`/bin/rm`, `env rm`, `xargs -0 rm`, `sort -o`, `make clean`
// all got past one), so this is the other way round: the command is read as the shell reads it, and every command it
// runs must be on a short list of readers. src/lib/rules.mjs calls it for `npm run check`.
//
// What a Command may hold:
//   - the commands in READS and BUILTINS, a function it defines itself (`has() { …; }`), and the commands in HELD in
//     the forms that only read (`sed -n` with a script of p, d, q, = and s; `sort` without -o; `find` without -delete
//     or -fprint, and -exec only for a command in READS; `xargs` only for a command in READS; `uniq` on one input);
//   - `if`, `while`, `until`, `for`, `{ }`, `( )`, `!`, `&&`, `||`, `|`, `;`, `$( )` and backticks, `VAR=value`;
//   - the redirects `< file`, `>/dev/null`, `2>/dev/null`, `2>&1` and `>&2`.
// Anything else fails, with what was found: a command given as `$c`, `'rm'`, `\rm` or a path, `case`, a here-document,
// a comment. Adding a program means adding it here, after checking that no option of it writes or runs something.

/** Programs that cannot write a file or run another program whatever their arguments, so `xargs` and `find -exec`,
 *  which hand them arguments this check never sees, may run them too. */
const READS = new Set(["[", "test", "grep", "head", "tail", "wc", "cut", "tr", "cat", "ls", "dirname", "basename", "echo", "printf", "true", "false"]);
/** Shell builtins that steer the command itself. */
const BUILTINS = new Set([":", "exit", "return", "break", "continue"]);
const RESERVED = new Set(["if", "then", "elif", "else", "fi", "do", "done", "while", "until", "{", "}", "!"]);
const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
// Setting one of these would change which program a listed name runs.
const STEERS = /^(?:PATH|LD_\w+|DYLD_\w+)$/;

class Refusal extends Error {}
const refuse = (what) => {
  throw new Refusal(what);
};

/**
 * The command as tokens: `{ op }` for ; & | ( ) && || ;;, `{ redirect, fd, target }`, and words. A word carries `raw`
 * (as written), `lit` (its text with the quotes taken off and the expansions left out), `bare` (written without quotes,
 * backslashes or expansions: the only way a command may be named), `dynamic` (it holds an expansion), `opens` (it
 * starts with one, so its value could be an option) and `subs` (the commands inside its `$( )` and backticks).
 */
function scan(src) {
  const n = src.length;
  const tokens = [];
  let i = 0;

  // The index of the ")" that closes a "$(" whose body starts at j.
  const closing = (j) => {
    for (let depth = 1; j < n; ) {
      const c = src[j];
      if (c === "\\") j += 2;
      else if (c === "'") j = quote(j) + 1;
      else if (c === "`") j = tick(j) + 1;
      else if (c === '"') {
        for (j++; j < n && src[j] !== '"'; ) {
          if (src[j] === "\\") j += 2;
          else if (src[j] === "$" && src[j + 1] === "(") j = closing(j + 2) + 1;
          else if (src[j] === "`") j = tick(j) + 1;
          else j++;
        }
        if (j++ >= n) refuse('an unclosed "');
      } else if (c === "(") depth++, j++;
      else if (c === ")") {
        if (--depth === 0) return j;
        j++;
      } else j++;
    }
    return refuse("an unclosed $(");
  };
  const quote = (j) => {
    const end = src.indexOf("'", j + 1);
    return end < 0 ? refuse("an unclosed '") : end;
  };
  const tick = (j) => {
    for (j++; j < n && src[j] !== "`"; ) j += src[j] === "\\" ? 2 : 1;
    return j < n ? j : refuse("an unclosed `");
  };

  // An expansion at i, "$…" or a backtick: skipped, and the commands it holds kept in w.subs.
  const expansion = (w) => {
    const found = () => {
      if (!w.dynamic && w.lit === "") w.opens = true;
      w.dynamic = true;
    };
    if (src[i] === "`") {
      const end = tick(i);
      w.subs.push(src.slice(i + 1, end).replace(/\\([`\\$])/g, "$1"));
      i = end + 1;
      return found();
    }
    if (src[i + 1] === "(") {
      const end = closing(i + 2);
      w.subs.push(src.slice(i + 2, end));
      i = end + 1;
      return found();
    }
    if (src[i + 1] === "{") {
      // "${r:-0}": to its "}", following any expansion inside. A quote in there means something else inside double
      // quotes than outside them, so it isn't followed at all.
      for (i += 2; src[i] !== "}"; ) {
        if (i >= n) refuse("an unclosed ${");
        if (src[i] === "'" || src[i] === '"' || src[i] === "\\") refuse("a quote or a backslash inside ${ }");
        if (src[i] === "$" || src[i] === "`") expansion({ lit: "x", dynamic: true, subs: w.subs });
        else i++;
      }
      i++;
      return found();
    }
    const v = /^\$(?:[A-Za-z_][A-Za-z0-9_]*|[0-9@*#?$!-])/.exec(src.slice(i, i + 80));
    if (!v) return (w.lit += src[i++]); // a "$" on its own is a "$"
    i += v[0].length;
    found();
  };

  const word = () => {
    const w = { raw: "", lit: "", bare: true, dynamic: false, opens: false, subs: [] };
    const start = i;
    while (i < n && !" \t\n;&|()<>".includes(src[i])) {
      const c = src[i];
      if (c === "'") {
        const end = quote(i);
        w.lit += src.slice(i + 1, end);
        w.bare = false;
        i = end + 1;
      } else if (c === '"') {
        w.bare = false;
        for (i++; src[i] !== '"'; ) {
          if (i >= n) refuse('an unclosed "');
          if (src[i] === "\\" && '$`"\\'.includes(src[i + 1])) (w.lit += src[i + 1]), (i += 2);
          else if (src[i] === "$" || src[i] === "`") expansion(w);
          else w.lit += src[i++];
        }
        i++;
      } else if (c === "\\") {
        if (i + 1 >= n) refuse("a backslash at its end");
        w.lit += src[i + 1];
        w.bare = false;
        i += 2;
      } else if (c === "$" || c === "`") expansion(w);
      else w.lit += src[i++];
    }
    w.raw = src.slice(start, i);
    if (w.dynamic) w.bare = false;
    return w;
  };

  while (i < n) {
    const c = src[i];
    if (c === " " || c === "\t") i++;
    else if (c === "\n") tokens.push({ op: ";" }), i++;
    else if (c === "#") refuse("a # comment");
    else if (["&&", "||", ";;"].includes(src.slice(i, i + 2))) tokens.push({ op: src.slice(i, i + 2) }), (i += 2);
    else if (";&|()".includes(c)) tokens.push({ op: c }), i++;
    else {
      const r = /^(\d*)(<<-?|<>|<&|>>|>&|>\||<|>)[ \t]*/.exec(src.slice(i, i + 80));
      if (!r) tokens.push(word());
      else {
        i += r[0].length;
        const target = word();
        if (target.raw === "") refuse(`a redirect to nothing (${r[1]}${r[2]})`);
        tokens.push({ redirect: r[2], fd: r[1], target });
      }
    }
  }
  return tokens;
}

function redirect({ redirect: op, fd, target }) {
  const to = target.dynamic ? null : target.lit;
  if (op === "<") return; // reads a file
  if ((op === ">" || op === ">>") && to === "/dev/null") return;
  if ((op === ">&" || op === "<&") && /^(?:\d|-)$/.test(to ?? "")) return; // 2>&1, >&2
  if (op.startsWith("<<")) refuse("a here-document");
  refuse(`a redirect into a file: ${fd}${op}${target.raw}`);
}

/** A variable the command sets (`VAR=…`, `read VAR`, `for VAR in`). */
function sets(name) {
  if (STEERS.test(name)) refuse(`${name} set, which changes the programs its commands run`);
}

/** The program `find -exec` or `xargs` runs: one of READS, named plainly. */
function hands(words, by) {
  const [cmd] = words;
  if (cmd && !(cmd.bare && READS.has(cmd.raw))) refuse(`${by} running ${cmd.raw}; it may run only ${[...READS].join(", ")}`);
}

/** An argument that holds an expansion and could turn out to be an option ("$o", "-$x"). */
const maybeOption = (a) => a.dynamic && (a.opens || a.lit.startsWith("-"));

/**
 * Whether a sed script stays inside the commands that only print or drop lines: addresses, then one of
 * p d D q Q = n N P h H g G x { }, or s and y. Anything else fails: w, r and e write a file, read one or run a program
 * (as do the w and e flags of s), and the rest (a, i, c, labels) is more than this small reader follows.
 */
function sedReads(script) {
  const n = script.length;
  let i = 0;
  // Past the delimiter that closes a regex or a replacement. False when it never closes, or when the delimiter sits
  // inside a bracket expression: seds differ on whether that one closes, so the script would not mean one thing.
  const closes = (d, regex) => {
    for (; i < n && script[i] !== d; i++) {
      if (script[i] === "\\") i++;
      else if (regex && script[i] === "[") {
        i++;
        if (script[i] === "^") i++;
        if (script[i] === "]") i++;
        for (; i < n && script[i] !== "]"; i++) {
          if (script[i] === d) return false;
          if (script[i] === "[" && ":.=".includes(script[i + 1] ?? " ")) {
            const end = script.indexOf(`${script[i + 1]}]`, i + 2);
            if (end < 0 || script.slice(i, end).includes(d)) return false;
            i = end + 1;
          }
        }
        if (i >= n) return false;
      }
    }
    return i++ < n;
  };
  // true: an address was read; false: there is none here; null: one that never closes.
  const address = () => {
    const c = script[i];
    if (/[0-9]/.test(c ?? "")) {
      while (/[0-9~]/.test(script[i] ?? "")) i++;
      return true;
    }
    if (c === "$") return i++, true;
    if (c !== "/" && c !== "\\") return false;
    const d = c === "/" ? c : script[i + 1];
    i += c === "/" ? 1 : 2;
    if (!d || !closes(d, true)) return null;
    while (/[IM]/.test(script[i] ?? "")) i++;
    return true;
  };
  const spaces = () => {
    while (script[i] === " ") i++;
  };
  for (;;) {
    while (/[ \t\n;]/.test(script[i] ?? "")) i++;
    if (i >= n) return true;
    const first = address();
    if (first === null) return false;
    spaces();
    if (first && script[i] === ",") {
      i++;
      spaces();
      if (/[+~]/.test(script[i] ?? "")) i++;
      if (address() !== true) return false;
    }
    while (/[ !]/.test(script[i] ?? "")) i++;
    const c = script[i++];
    if (c === undefined) return false; // an address and no command
    if ("pdD=nNPhHgGx{}".includes(c)) continue;
    if (c === "q" || c === "Q") {
      while (/[ 0-9]/.test(script[i] ?? "")) i++; // its exit status
      continue;
    }
    if (c !== "s" && c !== "y") return false;
    const d = script[i++];
    if (!d || /[\s\\]/.test(d)) return false;
    if (!closes(d, c === "s") || !closes(d, false)) return false;
    if (c === "s") while (/[gpIiMm0-9]/.test(script[i] ?? "")) i++;
    if (i < n && !/[ \t\n;}]/.test(script[i])) return false; // a flag that isn't one of those: w and e are the others
  }
}

/** The commands that read only in some forms, each given its arguments. */
const HELD = {
  // -n, and a script this check can read to its end (sedReads). Never -i, --in-place or -f.
  sed(args) {
    const scripts = [];
    let quiet = false;
    let ended = false; // after "--"
    let named = false; // a script came with -e, so no bare argument is one
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      const script = () => (a.dynamic ? refuse(`sed with a script that holds an expansion (${a.raw}); write it out`) : scripts.push(a.lit));
      if (!ended && maybeOption(a)) refuse(`sed with ${a.raw}, which could turn out to be an option; put -- before it`);
      else if (ended || a.dynamic || !/^-./.test(a.lit)) {
        if (!named && !scripts.length) script();
      } else if (a.lit === "--") ended = true;
      else if (a.lit === "--quiet" || a.lit === "--silent") quiet = true;
      else if (a.lit === "--regexp-extended" || a.lit === "--posix") continue;
      else if (/^-[nErsuz]*e?$/.test(a.lit)) {
        if (a.lit.includes("n")) quiet = true;
        if (!a.lit.endsWith("e")) continue;
        named = true;
        if (++k >= args.length) refuse("sed -e without its script");
        const s = args[k];
        s.dynamic ? refuse(`sed with a script that holds an expansion (${s.raw}); write it out`) : scripts.push(s.lit);
      } else refuse(`sed ${a.lit}; only -n, -E, -e and -- are let through`);
    }
    if (!quiet) refuse("sed without -n");
    for (const s of scripts) {
      if (!sedReads(s)) refuse(`a sed script that goes beyond addresses, p, d, q, = and s///[gp] (w, r and e write, read or run): ${s}`);
    }
  },
  // -o and --output write the file they name; --compress-program runs one.
  sort(args) {
    for (const a of args) {
      if (!a.dynamic && a.lit === "--") return;
      if (maybeOption(a)) refuse(`sort with ${a.raw}, which could turn out to be an option; put -- before it`);
      if (!a.dynamic && (/^--(?:o|co)/.test(a.lit) || /^-[^-]*o/.test(a.lit))) refuse(`sort ${a.lit}`);
    }
  },
  // Its second file is the one it writes.
  uniq(args) {
    if (args.some((a) => a.dynamic)) refuse("uniq with an expansion in its arguments");
    if (args.filter((a) => a.lit === "-" || !a.lit.startsWith("-")).length > 1) refuse("uniq with a second file, which it writes");
  },
  // Tests and -print. No action that writes or deletes, and -exec only for a command in READS.
  find(args) {
    const takesValue = new Set(["-name", "-iname", "-path", "-ipath", "-regex", "-iregex", "-type", "-maxdepth", "-mindepth", "-newer"]);
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      const afterTest = k > 0 && !args[k - 1].dynamic && takesValue.has(args[k - 1].lit);
      if (maybeOption(a) && !afterTest) refuse(`find with ${a.raw}, which could turn out to be -delete`);
      if (a.dynamic || afterTest) continue;
      if (a.lit === "-exec" || a.lit === "-execdir") {
        const end = args.findIndex((b, j) => j > k && !b.dynamic && (b.lit === ";" || b.lit === "+"));
        if (end < 0) refuse(`find ${a.lit} without its ; or +`);
        hands(args.slice(k + 1, end), `find ${a.lit}`);
        k = end;
      } else if (/^-(?:ok|okdir|delete|fprint.*|fls)$/.test(a.lit)) refuse(`find ${a.lit}`);
    }
  },
  // Only the options that say how to split the input, then a command in READS.
  xargs(args) {
    let k = 0;
    for (; k < args.length; k++) {
      const a = args[k];
      if (a.dynamic) refuse(`xargs with ${a.raw}, which could turn out to be an option or a command`);
      if (!a.lit.startsWith("-")) break;
      if (/^-[0rtx]+$/.test(a.lit) || /^-[nLPs]\d+$/.test(a.lit) || /^-[Id]./.test(a.lit)) continue;
      if (/^-[nLPsId]$/.test(a.lit)) k++; // its value is the next word
      else refuse(`xargs ${a.lit}`);
    }
    hands(args.slice(k), "xargs");
  },
  read(args) {
    for (const a of args) {
      if (a.bare && a.raw === "-r") continue;
      if (!a.bare || !NAME.test(a.raw)) refuse(`read ${a.raw}; it takes -r and names`);
      sets(a.raw);
    }
  },
};

/** One simple command: `VAR=value` words, then a command that is on the list. */
function simple(words, functions) {
  let k = 0;
  for (; k < words.length; k++) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(words[k].raw);
    if (!m) break;
    sets(m[1]);
  }
  const [cmd, ...args] = words.slice(k);
  if (!cmd) return; // "n=$(…)" alone
  if (!cmd.bare) refuse(`${cmd.raw} where a command goes; a command is named plainly, not through quotes, a backslash or a variable`);
  const name = cmd.raw;
  if (functions.has(name) || READS.has(name) || BUILTINS.has(name)) return;
  if (!Object.hasOwn(HELD, name)) refuse(`${name}, which is not on the list of commands that only read (src/lib/command.mjs)`);
  HELD[name](args);
}

/**
 * A whole command, or the inside of a "$( )". `functions` holds the functions defined so far, which later commands may
 * call: their bodies are checked like everything else. A function counts only once the shell is sure to have it, so
 * the name can't fall through to a program: defined at the top of the Command (`top`), on its own between ";", with a
 * "{ }" body, not in a pipeline, a condition, a subshell or another function.
 */
function check(src, functions, top) {
  const tokens = scan(src);
  const isName = (t) => t && t.bare && NAME.test(t.raw);
  const defines = (k) => isName(tokens[k]) && tokens[k + 1]?.op === "(" && tokens[k + 2]?.op === ")";
  // The commands inside a word's "$( )" and backticks: a subshell, so what they define stays in there.
  const inside = (w) => w.subs.forEach((s) => check(s, new Set(functions), false));
  const aside = (t) => (redirect(t), inside(t.target));
  let depth = 0; // how many ( ), { }, if, while, until and for we are inside
  let defining = null; // the function whose body is being read
  for (let k = 0; k < tokens.length; ) {
    const t = tokens[k];
    if (t.op) {
      if (t.op === ";;") refuse("a case statement");
      depth += t.op === "(" ? 1 : t.op === ")" ? -1 : 0;
      k++; // the next word is where a command goes
    } else if (t.redirect) aside(tokens[k++]);
    else if (t.bare && RESERVED.has(t.raw)) {
      if (["{", "if", "while", "until"].includes(t.raw)) depth++;
      else if (["}", "fi", "done"].includes(t.raw) && --depth === 0 && defining) {
        if (t.raw === "}" && (k + 1 === tokens.length || tokens[k + 1].op === ";")) functions.add(defining);
        defining = null;
      }
      k++; // still where a command goes
    } else if (t.bare && t.raw === "for") {
      // "for f in a b; do": a name and a list, no command.
      if (!isName(tokens[k + 1])) refuse("a for without a plain name");
      sets(tokens[k + 1].raw);
      depth++;
      for (k += 2; k < tokens.length && !tokens[k].op; k++) tokens[k].redirect ? aside(tokens[k]) : inside(tokens[k]);
    } else if (defines(k)) {
      const alone = top && depth === 0 && (k === 0 || tokens[k - 1].op === ";");
      if (alone && tokens[k + 3]?.bare && tokens[k + 3].raw === "{") defining = t.raw;
      k += 3;
    } else {
      const words = [];
      for (; k < tokens.length && !tokens[k].op; k++) {
        if (tokens[k].redirect) aside(tokens[k]);
        else inside(tokens[k]), words.push(tokens[k]);
      }
      simple(words, functions);
    }
  }
}

/**
 * What in `command` could write, run a program off the list or reach the network, as a phrase ("rm, which is not on
 * the list…"), or null when it only reads.
 */
export function notReadOnly(command) {
  try {
    check(command, new Set(), true);
    return null;
  } catch (e) {
    if (e instanceof Refusal) return e.message;
    throw e;
  }
}
