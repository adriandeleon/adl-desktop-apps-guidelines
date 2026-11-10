// Whether a rule's Command only reads (AGENTS.md, "Rule IDs"). Agents run a Command with `sh -c` in an app's
// repository, from a file they downloaded, so it may not write a file, start a program of its choosing or reach the
// network. A list of forbidden programs can't hold that (`/bin/rm`, `env rm`, `xargs -0 rm`, `sort -o`, `make clean`
// all got past one), so this is the other way round: the command is read as the shell reads it, and every command it
// runs must be on a short list of readers. src/lib/rules.mjs calls it for `npm run check`.
//
// `sh` is dash on one machine and bash on another (macOS, Git for Windows), and bash reads more into the same text:
// `{a,b}`, `$'…'`, `$[ ]`, `(( ))`, `${x@P}`, `${!x}`, `/dev/tcp/…`, `printf -v`, `[ -v ]`, and a variable's value
// evaluated as an expression inside `$(( ))` (which runs any `$( )` it holds). So what is let through is what both
// shells read the same way, and anything this reader does not know fails.
//
// What a Command may hold:
//   - the commands in READS and BUILTINS, a function it defines itself (`has() { …; }`, under a name no shell and no
//     list here uses), `cd` inside `( )` or `$( )`, and the commands in HELD in the forms that only read (`sed -n`
//     with a script of p, d, q, = and s; `sort` with the options listed there, which leaves out -o, -T and every
//     option that takes a value in one sort and none in another; `find` with the tests and actions listed there, and
//     -exec only for a command in READS; `xargs` only for a command in READS; `uniq` on one input);
//   - `if`, `while`, `until`, `for`, `{ }`, `( )`, `!`, `&&`, `||`, `|`, `;`, `$( )` and backticks, `$(( ))` over
//     numbers and the variables the Command itself sets to numbers;
//   - `var=value` for names of its own, in lowercase (`IFS=` and `LC_ALL=C` are the two others): an uppercase name is
//     the shell's or a program's, and PATH, IFS, ENV, BASH_ENV, LD_PRELOAD and their kind change what a command runs;
//   - the redirects `< file`, `>/dev/null`, `>>/dev/null`, `2>/dev/null`, `2>&1` and `>&2`.
// Anything else fails, with what was found: a command given as `$c`, `'rm'`, `\rm` or a path, `case`, a here-document,
// a comment, a redirect from `/dev/tcp/…` or from a variable that could hold it, an expansion left unquoted where its
// value could turn into an option. Adding a program means adding it here, after checking that no option of it writes
// or runs something, in GNU's, BSD's and busybox's version of it, and as a bash builtin if it is one.
// When unsure, this refuses: a Command that fails here can be written another way; one that passes is run unread.

/** Programs that cannot write a file or run another program whatever their arguments, so `xargs` and `find -exec`,
 *  which hand them arguments this check never sees, may run them too. As shell builtins three of them can do more
 *  (`printf -v` and `%n` set a variable, `[ -v` and `test -v` evaluate a subscript): simple() holds those. */
const READS = new Set(["[", "test", "grep", "head", "tail", "wc", "cut", "tr", "cat", "ls", "dirname", "basename", "echo", "printf", "true", "false"]);
/** Shell builtins that steer the command itself. */
const BUILTINS = new Set([":", "exit", "return", "break", "continue"]);
const RESERVED = new Set(["if", "then", "elif", "else", "fi", "do", "done", "while", "until", "{", "}", "!"]);
const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
// A name of the Command's own. Shells and programs read uppercase names (PATH, IFS, ENV, BASH_ENV, CDPATH, PS4,
// LD_PRELOAD, GCONV_PATH, POSIXLY_CORRECT…) and `_`; no lowercase name changes what a listed command does.
const OWN = /^[a-z][a-z0-9_]*$/;
const LOCALE = /^(?:LC_ALL|LC_COLLATE|LC_CTYPE|LANG)=(?:C|POSIX|C\.UTF-8)$/;
// What a function may not be called: a shell's builtins and words (a special builtin runs before a function of its
// name, so `eval() { :; }; eval …` would run eval), and the commands listed here, which `xargs` and this reader take
// for the programs.
const NOT_A_FUNCTION = new Set(
  (". : [ [[ ]] alias bg bind break builtin caller case cd chdir command compgen complete compopt continue coproc declare " +
    "dirs disown do done echo elif else enable esac eval exec exit export false fc fg fi for function getopts hash help " +
    "history if in jobs kill let local logout mapfile popd printf pushd pwd read readarray readonly return select set " +
    "shift shopt source suspend test then time times trap true type typeset ulimit umask unalias unset until wait while " +
    "find sed sort uniq xargs grep head tail wc cut tr cat ls dirname basename"
  ).split(" "),
);

class Refusal extends Error {}
const refuse = (what) => {
  throw new Refusal(what);
};

/**
 * The command as tokens: `{ op }` for ; & | ( ) && || ;;, `{ redirect, fd, target }`, and words. A word carries:
 *   raw      as written
 *   lit      its text with the quotes taken off and the expansions left out
 *   head     the part of `lit` before its first expansion (all of it when there is none)
 *   bare     written without quotes, backslashes or expansions: the only way a command may be named
 *   dynamic  it holds an expansion; `opens` when it starts with one, so its value could be an option
 *   kinds    its expansions in order: "var" ($x, ${x}), "number" ($#, $?, ${#x}, $(( ))), "many" ($@, $*), "sub"
 *            ($( ) and backticks), "arith", "other"
 *   loose    the plain variables it expands outside double quotes, whose values the shell splits into words
 *   wild     it expands something else outside double quotes ($( ), ${x:-y}, $1, $@)
 *   many     it holds $@ or $*, which is several words even in double quotes
 *   only     the variable's name when the whole word is one variable: "$d", $d, "${d}"
 *   glob     it starts with an unquoted * ? or [, so a file's name could make it an option; `globs` when it holds
 *            one anywhere, so it could be several words
 *   subs     the commands inside its `$( )` and backticks
 *   nums     the variables its `$(( ))` read
 *   sets     the variables its `${x:=…}` set
 */
function scan(src) {
  const n = src.length;
  const tokens = [];
  let i = 0;
  // A NUL would end the command for the shell and not for this reader; a carriage return or an escape has no place.
  if (/[\x00-\x08\x0b-\x1f\x7f]/.test(src)) refuse("a control character");
  // Outside quotes a byte above ASCII can be a blank to the shell (0xA0 in a Latin-1 locale), which would split a word
  // here read as one.
  const plain = (c) => (c.charCodeAt(0) > 126 ? refuse(`"${c}" outside quotes; only ASCII is read the same by every shell there`) : c);

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

  // "$(( … ))" at i: numbers, the Command's own variables and operators that assign nothing. bash evaluates a
  // variable's value as an expression of its own, subscripts and their `$( )` included, so each variable must be one
  // the Command sets to a number (check() sees to that, from w.nums).
  const arithmetic = (w) => {
    let j = i + 3;
    for (let depth = 0; j < n; j++) {
      if (src[j] === "(") depth++;
      else if (src[j] === ")" && depth-- === 0) break;
    }
    if (src[j] !== ")" || src[j + 1] !== ")") refuse("a $(( without its )); a subshell inside $( ) is written $( ( … ) )");
    const body = src.slice(i + 3, j);
    const token = /\s+|0[xX][0-9a-fA-F]+|\d+|\$?([a-z][a-z0-9_]*)|\$\{([a-z][a-z0-9_]*)\}|\$[#?]|==|!=|<=|>=|&&|\|\||<<|>>|[-+*\/%()<>!&|^~?:]/y;
    for (let at = 0; at < body.length; at = token.lastIndex) {
      token.lastIndex = at;
      const m = token.exec(body);
      if (!m) refuse(`$((${body})) holds "${body.slice(at, at + 12)}"; it takes numbers, lowercase variables and operators that assign nothing`);
      if (m[1] ?? m[2]) w.nums.push(m[1] ?? m[2]);
    }
    if (/\+\+|--/.test(body)) refuse(`$((${body})) holds ++ or --, which assigns`);
    i = j + 2;
  };

  // An expansion at i, "$…" or a backtick: skipped, and what it holds kept in w. `quoted`: inside double quotes.
  const expansion = (w, quoted) => {
    const found = (kind, name) => {
      if (!w.dynamic) (w.head = w.lit), (w.opens = w.lit === "");
      w.dynamic = true;
      w.kinds.push(kind);
      if (kind === "many") w.many = true;
      if (quoted || kind === "number" || kind === "arith") return;
      if (kind === "var") w.loose.push(name);
      else w.wild = true;
    };
    // An expansion inside another's "${x:-…}": what it holds counts for w, what it is does not.
    const nested = () => {
      const inner = Object.assign(Object.create(w), { lit: "x", dynamic: true, kinds: [], loose: [], many: false, wild: false });
      expansion(inner, true);
      if (inner.many) w.many = true;
    };
    if (src[i] === "`") {
      const end = tick(i);
      const body = src.slice(i + 1, end);
      // Which backslashes a backtick takes off depends on the quotes around it; `$( )` has no such question.
      if (body.includes("\\")) refuse("a backslash inside backticks; write $( ) instead");
      w.subs.push(body);
      i = end + 1;
      return found("sub");
    }
    if (src[i + 1] === "(" && src[i + 2] === "(") {
      arithmetic(w);
      return found("arith");
    }
    if (src[i + 1] === "(") {
      const end = closing(i + 2);
      w.subs.push(src.slice(i + 2, end));
      i = end + 1;
      return found("sub");
    }
    if (src[i + 1] === "{") {
      // "${x}", "${#x}" and "${x:-word}" with the operators every shell has: - + ? = (with or without the colon), #
      // and %. bash's others run or evaluate something: ${!x} and ${x[i]} evaluate a subscript, ${x:i} an expression,
      // ${x@P} a prompt string.
      const m = /^\$\{(#?)([A-Za-z_][A-Za-z0-9_]*|[0-9]+|[@*#?$!-])(:?[-+?=]|##?|%%?)?/.exec(src.slice(i, i + 200));
      const [, length, name, op] = m ?? [];
      const after = m ? src[i + m[0].length] : "";
      if (!m || (length && op) || (!op && after !== "}")) {
        refuse(`${src.slice(i, i + 16)}…; inside \${ } only a name, \${#x} and the operators - + ? = # % are read`);
      }
      if (!op) {
        i += m[0].length + 1;
        return found(length || "#?$!".includes(name) ? "number" : name === "@" || name === "*" ? "many" : NAME.test(name) ? "var" : "other", name);
      }
      if (op.endsWith("=")) NAME.test(name) ? w.sets.push(name) : refuse(`\${${name}${op}…}, which assigns to no name`);
      // To its "}", following any expansion inside. A quote in there means something else inside double quotes than
      // outside them, so it isn't followed at all.
      for (i += m[0].length; src[i] !== "}"; ) {
        if (i >= n) refuse("an unclosed ${");
        if ("'\"\\{".includes(src[i])) refuse("a quote, a backslash or a brace inside ${ }");
        if (src[i] === "$" || src[i] === "`") nested();
        else i++;
      }
      i++;
      if (name === "@" || name === "*") w.many = true;
      return found("other");
    }
    const v = /^\$(?:([A-Za-z_][A-Za-z0-9_]*)|([0-9@*#?$!-]))/.exec(src.slice(i, i + 80));
    if (!v) {
      // "$'…'" is a string with escapes in bash ($'\x2ddelete') and "$[ ]" arithmetic; "$"…"" a translated string.
      if (src[i + 1] === "[" || (!quoted && (src[i + 1] === "'" || src[i + 1] === '"'))) {
        refuse(`${src.slice(i, i + 2)}, which bash reads as a string with escapes or as arithmetic`);
      }
      return (w.lit += src[i++]); // a "$" on its own is a "$"
    }
    i += v[0].length;
    if (v[1]) return found("var", v[1]);
    found("@*".includes(v[2]) ? "many" : "#?$!".includes(v[2]) ? "number" : "other");
  };

  const word = () => {
    const w = { raw: "", lit: "", head: "", bare: true, dynamic: false, opens: false, kinds: [], loose: [], wild: false, many: false, only: null, glob: false, globs: false, subs: [], nums: [], sets: [] };
    const start = i;
    let brace = false; // an unquoted { or } that is not the pair "{}"
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
          if (src[i] === "\\" && src[i + 1] === "\n") refuse("a backslash before a line break");
          if (src[i] === "\\" && '$`"\\'.includes(src[i + 1])) (w.lit += src[i + 1]), (i += 2);
          else if (src[i] === "$" || src[i] === "`") expansion(w, true);
          else w.lit += src[i++];
        }
        i++;
      } else if (c === "\\") {
        if (i + 1 >= n) refuse("a backslash at its end");
        if (src[i + 1] === "\n") refuse("a backslash before a line break");
        w.lit += plain(src[i + 1]);
        w.bare = false;
        i += 2;
      } else if (c === "$" || c === "`") expansion(w, false);
      else if (c === "{" && src[i + 1] === "}") (w.lit += "{}"), (i += 2); // find's and xargs's placeholder
      else {
        if (c === "{" || c === "}") brace = true;
        if ("*?[".includes(c)) (w.globs = true), (w.glob ||= w.lit === "" && !w.dynamic);
        w.lit += plain(c);
        i++;
      }
    }
    w.raw = src.slice(start, i);
    if (brace && w.raw !== "{" && w.raw !== "}") refuse(`${w.raw}, whose braces bash expands into words of its own ({-a,-b} is -a -b); quote them`);
    if (w.dynamic) w.bare = false;
    else w.head = w.lit;
    const one = /^(?:"\$(\w+)"|"\$\{(\w+)\}"|\$(\w+)|\$\{(\w+)\})$/.exec(w.raw);
    const name = one?.slice(1).find(Boolean);
    if (name && NAME.test(name)) w.only = name;
    return w;
  };

  while (i < n) {
    const c = src[i];
    if (c === " " || c === "\t") i++;
    else if (c === "\n") tokens.push({ op: ";" }), i++;
    else if (c === "#") refuse("a # comment");
    else if (src.startsWith("((", i)) refuse("((, which bash reads as arithmetic; a subshell in a subshell is written ( ( … ) )");
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

/** Whether a word's value is one word whatever its variables hold: nothing in it is expanded outside double quotes. */
const whole = (w) => !w.wild && !w.many && !w.loose.length;

// What a variable may hold where its value decides something: the start of a path that is neither an option nor
// /dev/tcp. A `for` over words written out, each starting this way, gives its variable only such values.
const PATHLIKE = /^[A-Za-z0-9._]/;

/**
 * The redirects that write nothing and open nothing but a file: `< file`, `>/dev/null` and `>>/dev/null` (of the
 * output or of the errors, `2>/dev/null`), `2>&1`, `>&2`.
 * bash opens `/dev/tcp/host/port` and `/dev/udp/…` as a connection, in any redirect and after expanding the word, so
 * a file read through a variable is let through only when the variable can't hold that.
 */
function redirect({ redirect: op, fd, target }, ctx) {
  const said = `${fd}${op}${target.raw}`;
  const to = target.dynamic ? null : target.lit;
  if (op.startsWith("<<")) refuse("a here-document");
  if (op === "<" && (fd === "" || fd === "0")) {
    if (to !== null) {
      if (/^\/dev\/(?!null$)/.test(to)) refuse(`a redirect from ${to}; bash opens /dev/tcp/… and /dev/udp/… as network connections, and no check needs another device`);
      if (target.globs) refuse(`a redirect from a pattern (${said}); name the file`);
      return; // reads a file
    }
    if (!whole(target)) refuse(`a redirect from ${target.raw}, expanded outside double quotes; quote it`);
    if (PATHLIKE.test(target.head)) return; // "src/$f": whatever $f holds, not /dev/tcp
    if (target.only) return ctx.wants.push({ name: target.only, need: "path", what: `the redirect ${said}` });
    refuse(`a redirect from ${target.raw}, which could turn out to be /dev/tcp/…; start it with the folder ("src/$f"), or read a variable that is only set to names written out`);
  }
  if ((op === ">" || op === ">>") && to === "/dev/null" && ["", "1", "2"].includes(fd)) return;
  if (op === ">&" && ((fd === "2" && to === "1") || ((fd === "" || fd === "1") && to === "2"))) return; // 2>&1, >&2
  refuse(`the redirect ${said}; only < file, >/dev/null, >>/dev/null, 2>/dev/null, 2>&1 and >&2 are let through`);
}

/** The program `find -exec` or `xargs` runs: one of READS, named plainly. */
function hands(words, by) {
  const [cmd] = words;
  if (cmd && !(cmd.bare && READS.has(cmd.raw))) refuse(`${by} running ${cmd.raw}; it may run only ${[...READS].join(", ")}`);
}

/** An argument that could turn out to be an option: it starts with an expansion ("$o", "-$x") or with a pattern a
 *  file's name could match (`*`), or the shell splits its value into words. */
const maybeOption = (a) => !whole(a) || a.glob || (a.dynamic && (a.opens || a.lit.startsWith("-")));

/**
 * Whether a sed script stays inside the commands that only print or drop lines: addresses, then one of
 * p d D q Q = n N P h H g G x { }, or s and y. Anything else fails: w, r and e write a file, read one or run a program
 * (as do the w and e flags of s), and the rest (a, i, c, labels) is more than this small reader follows.
 */
function sedReads(script) {
  const n = script.length;
  let i = 0;
  // Past the delimiter that closes a regex or a replacement. False when it never closes or a line breaks inside it.
  // A delimiter inside a bracket expression ("s/[^/]*$//p") does not close for GNU, BSD and busybox sed; for a sed
  // that reads it as closing, the rest of the script would be flags and commands this reader never saw. The only
  // ones that write or run are spelled w, W and e, so the script passes when none of those letters follows.
  const closes = (d, regex) => {
    for (; i < n && script[i] !== d; i++) {
      if (script[i] === "\n") return false;
      if (script[i] === "\\") i++;
      else if (regex && script[i] === "[") {
        i++;
        if (script[i] === "^") i++;
        if (script[i] === "]") i++;
        for (; i < n && script[i] !== "]"; i++) {
          if (script[i] === "\n" || (script[i] === d && /[wWe]/.test(script.slice(i)))) return false;
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

// find's tests and actions that only look, with the number of words each takes after it: the same number in GNU,
// BSD and busybox find, so each test takes exactly its value here as there, and the word after it is read as a test
// again. A word that is not on these lists fails, whatever it is: -delete, -fprint, -ok, -fls, -files0-from, and
// `-depth`, which takes a number in BSD find and none in GNU's.
const FIND_ALONE = new Set(["!", "(", ")", "-not", "-a", "-and", "-o", "-or", "-print", "-print0", "-prune", "-empty", "-quit", "-true", "-false", "-xdev", "-mount"]);
const FIND_VALUE = new Set(
  ("-name -iname -path -ipath -wholename -iwholename -regex -iregex -type -maxdepth -mindepth -newer -anewer -cnewer -size " +
    "-mtime -mmin -atime -amin -ctime -cmin -perm -user -group -links -inum -samefile -lname -ilname").split(" "),
);

// sort's options that only say how to compare, check or merge, and the two that take a value: a key and a separator.
// Each letter is the same in GNU, BSD (FreeBSD and macOS, OpenBSD, NetBSD), busybox and toybox sort: none of SORT_FLAGS
// takes a value in any of them, and -k and -t take one in all. That is what lets this reader tell an option from a
// value and from the "--" that ends the options: a letter that takes a value in one sort and none in another (-S, a
// size in GNU and a flag in NetBSD; -R and -z the other way round, in NetBSD and Solaris) would have each read the
// words after it differently, so none is on the list. Nor are -o and --output, which write the file they name, -T,
// which names a folder for sort's temporary files, and --compress-program, which runs a program. A long option is
// written in full: GNU takes any unambiguous start of one (--outp), and which starts are unambiguous differs.
const SORT_FLAGS = "bCcdfghiMmnrsuV";
const SORT_VALUE = "kt";
const SORT_LONG = new Set(
  ("check dictionary-order general-numeric-sort human-numeric-sort ignore-case ignore-leading-blanks ignore-nonprinting " +
    "merge month-sort numeric-sort reverse stable unique version-sort").split(" "),
);
const SORT_LONG_VALUE = new Set(["key", "field-separator"]);

/** The commands that read only in some forms, each given its arguments and what check() keeps of the Command. */
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
      if (!whole(a)) refuse(`sed with ${a.raw}, expanded outside double quotes; quote it`);
      else if (!ended && maybeOption(a)) refuse(`sed with ${a.raw}, which could turn out to be an option; put -- before it`);
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
  // Options from SORT_FLAGS, SORT_VALUE, SORT_LONG and SORT_LONG_VALUE, each value-taking one with its value, read as
  // sort reads them: wherever they stand among the inputs, up to a "--" that is not itself an option's value.
  sort(args) {
    const known = `-${[...SORT_FLAGS].join(" -")}, -k and -t, and their long names written in full`;
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      if (!whole(a)) refuse(`sort with ${a.raw}, expanded outside double quotes; quote it`);
      if (maybeOption(a)) refuse(`sort with ${a.raw}, which could turn out to be an option; put -- before it`);
      const t = a.lit;
      if (a.dynamic || t === "-" || !t.startsWith("-")) continue; // an input
      if (t === "--") return; // the end of the options: every word after it is an input, whatever it holds
      // The option's value when it is the next word. Every sort takes that word whatever it is, "--" and "-o"
      // included; one that starts with "-" is refused all the same, so that passing never rests on that alone.
      const value = (option, joined) => {
        const v = args[++k];
        if (!v) refuse(`sort ${option} without its value`);
        if (!whole(v) || maybeOption(v)) refuse(`sort ${option} with the value ${v.raw}, which could turn out to be an option; write the value out`);
        if (!v.dynamic && v.lit.startsWith("-")) refuse(`sort ${option} ${v.lit}: a value that starts with - is written in the option's own word (${joined}${v.lit})`);
      };
      if (t.startsWith("--")) {
        const [name, ...given] = t.slice(2).split("=");
        if (SORT_LONG_VALUE.has(name)) {
          if (!given.length) value(`--${name}`, `--${name}=`);
        } else if (/^o/.test(name)) refuse(`sort ${t}; --output writes the file it names`);
        else if (/^co/.test(name)) refuse(`sort ${t}; --compress-program runs the program it names`);
        else if (!SORT_LONG.has(name) || (given.length && name !== "check")) refuse(`sort ${t}; it is let through with ${known}`);
        continue;
      }
      // "-un", "-t:", "-uk2,2": letters that take no value, then at most one that takes the rest of the word as its
      // value, or the next word when nothing is left of this one.
      for (let j = 1; j < t.length; j++) {
        const c = t[j];
        if (SORT_FLAGS.includes(c)) continue;
        if (SORT_VALUE.includes(c)) {
          if (j === t.length - 1) value(`-${c}`, `-${c}`);
          break;
        }
        if (c === "o") refuse(`sort ${t}; -o writes the file it names`);
        if (c === "T") refuse(`sort ${t}; -T names a folder for sort to write its temporary files in`);
        refuse(`sort ${t}; it is let through with ${known} (-S, -R, -z and their kind take a value in one sort and none in another, which would hide the words after them)`);
      }
    }
  },
  // Its second file is the one it writes: options, each with its number where it takes one, then one input at most.
  uniq(args) {
    let files = 0;
    let ended = false; // after "--"
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      if (a.dynamic || a.globs) refuse(`uniq with ${a.raw}; an expansion or a pattern could turn out to be a second file, which it writes`);
      const t = a.lit;
      if (ended || t === "-" || !t.startsWith("-")) {
        if (++files > 1) refuse("uniq with a second file, which it writes");
      } else if (t === "--") ended = true;
      else if (/^-[cdDiuz]+$/.test(t) || /^-[fsw]\d+$/.test(t)) continue;
      else if (/^--(?:count|repeated|unique|ignore-case|zero-terminated|(?:skip-fields|skip-chars|check-chars)=\d+)$/.test(t)) continue;
      else if (/^-[fsw]$/.test(t)) {
        const v = args[++k];
        if (!v || v.dynamic || !/^\d+$/.test(v.lit)) refuse(`uniq ${t} without its number`);
      } else refuse(`uniq ${t}`);
    }
  },
  // Start folders, then tests and actions from FIND_ALONE and FIND_VALUE, and -exec only for a command in READS.
  find(args, ctx) {
    // A value the shell could split, or that a file's name could turn into several words, would put words where
    // find reads tests.
    const one = (a, what) => {
      if (a.many) refuse(`find with ${a.raw} ${what}, which is as many words as it holds`);
      if (!whole(a)) refuse(`find with ${a.raw} ${what}, expanded outside double quotes; quote it`);
      if (a.glob) refuse(`find with the pattern ${a.raw} ${what}, unquoted: the shell matches it against the files here first; quote it`);
    };
    let k = 0;
    // Where to look: every word up to the first that starts a test. One read from a variable must be unable to
    // start one ("$d" holding -delete would be the expression).
    for (; k < args.length; k++) {
      const a = args[k];
      if (!a.dynamic && (a.lit.startsWith("-") || FIND_ALONE.has(a.lit) || a.lit === ",")) break;
      one(a, "as a start folder");
      if (!a.dynamic || PATHLIKE.test(a.head)) continue;
      if (a.only) ctx.wants.push({ name: a.only, need: "path", what: `find ${a.raw}` });
      else refuse(`find with ${a.raw} as a start folder, which could turn out to be -delete; start it with the folder ("src/$d"), or read a variable that is only set to names written out`);
    }
    for (; k < args.length; k++) {
      const a = args[k];
      if (a.dynamic) refuse(`find with ${a.raw} where a test goes; it could turn out to be -delete`);
      one(a, "where a test goes");
      const t = a.lit;
      if (FIND_ALONE.has(t)) continue;
      if (FIND_VALUE.has(t) || /^-newer[aBcm][aBcmt]$/.test(t)) {
        if (++k >= args.length) refuse(`find ${t} without its value`);
        one(args[k], `as ${t}'s value`);
      } else if (t === "-exec" || t === "-execdir") {
        // To its ";", or to a "+" right after "{}": what find itself ends the command at. A word in between that a
        // variable or a file's name could turn into one of those would end it early, and the words after it would be
        // tests.
        let end = k + 1;
        const ends = (j) => !args[j].dynamic && (args[j].lit === ";" || (args[j].lit === "+" && j > k + 1 && !args[j - 1].dynamic && args[j - 1].lit === "{}"));
        while (end < args.length && !ends(end)) end++;
        if (end >= args.length) refuse(`find ${t} without its ; or {} +`);
        const run = args.slice(k + 1, end);
        hands(run, `find ${t}`);
        for (const b of run.slice(1)) {
          one(b, `in ${t}'s command`);
          if (!b.dynamic || (b.lit !== "" && ![";", "+", "{}"].includes(b.lit))) continue;
          if (b.only) ctx.wants.push({ name: b.only, need: "path", what: `find ${t} … ${b.raw}` });
          else refuse(`find ${t} with ${b.raw}, which could turn out to be the ; that ends the command; write the value out`);
        }
        k = end;
      } else refuse(`find ${t}; it is let through with ${[...FIND_VALUE].slice(0, 6).join(", ")} and the other tests listed in src/lib/command.mjs, -print, -prune and -exec`);
    }
  },
  // Only the options that say how to split the input, then a command in READS.
  xargs(args) {
    let k = 0;
    let placeholder = null; // -I's
    const value = (a) => (!a || a.dynamic || a.globs ? refuse(`xargs with ${a?.raw ?? "an option without its value"}; write the value out`) : a.lit);
    for (; k < args.length; k++) {
      const a = args[k];
      if (a.dynamic || a.globs) refuse(`xargs with ${a.raw}, which could turn out to be an option or a command`);
      if (!a.lit.startsWith("-")) break;
      if (/^-[0rtx]+$/.test(a.lit) || /^-[nLPs]\d+$/.test(a.lit)) continue;
      if (/^-[Id]./.test(a.lit)) {
        if (a.lit[1] === "I") placeholder = a.lit.slice(2);
      } else if (/^-[nLPsId]$/.test(a.lit)) {
        const v = value(args[++k]); // its value is the next word
        if (a.lit === "-I") placeholder = v;
      } else refuse(`xargs ${a.lit}`);
    }
    hands(args.slice(k), "xargs");
    // Some xargs replace the placeholder in the command's own name, which would then be a line of the input.
    if (placeholder !== null && args[k] && (placeholder === "" || args[k].lit.includes(placeholder))) {
      refuse(`xargs -I ${placeholder} with a command whose name holds "${placeholder}"`);
    }
  },
  read(args, ctx) {
    for (const a of args) {
      if (a.bare && a.raw === "-r") continue;
      if (!a.bare || !NAME.test(a.raw)) refuse(`read ${a.raw}; it takes -r and names`);
      sets(ctx, a.raw, {});
    }
  },
  // Elsewhere it would move every command after it out of the app's root.
  cd(args, ctx, where) {
    if (!where.subshell) refuse("cd outside a subshell; write ( cd folder && … ), so the commands after it still run in the app's root");
  },
  // As a bash builtin: -v sets a variable, and so does %n in the format, which is why the format is written out.
  printf(args) {
    const format = args[0] && !args[0].dynamic && args[0].lit === "--" ? args[1] : args[0];
    if (!format) return;
    if (format.dynamic) refuse(`printf with the format ${format.raw}; write the format out and pass the value as its argument (printf '%s\\n' "$x")`);
    if (format.lit.startsWith("-")) refuse(`printf ${format.lit}; in bash -v sets a variable`);
    if (/%[-+ #0'I0-9.*hjlLtzq]*n/.test(format.lit.replace(/%%/g, ""))) refuse("printf with %n in its format, which sets a variable in bash");
  },
};

// `[` and `test` as bash runs them: -v evaluates its operand's subscript, and with it any `$( )` there. An operand
// read from a variable is let through only in the shapes whose operator is written out, so that no variable can
// turn out to be the operator: [ "$x" ], [ -n "$x" ], [ "$a" = "$b" ], each with ! before it.
const TEST_UNARY = new Set("-b -c -d -e -f -g -h -k -n -p -r -s -t -u -w -x -z -L -N -O -G -S".split(" "));
const TEST_BINARY = new Set(["=", "==", "!=", "-eq", "-ne", "-lt", "-le", "-gt", "-ge", "-nt", "-ot", "-ef"]);
function tests(name, args, ctx) {
  if (name === "[") {
    const last = args.at(-1);
    if (!last || last.dynamic || last.lit !== "]") refuse("[ without its ]");
    args = args.slice(0, -1);
  }
  for (const a of args) {
    // "$( … | wc -l )" alone is one number even unquoted, as a variable set to it is ([ $n -gt 3 ]).
    const count = a.kinds.length === 1 && a.kinds[0] === "sub" && a.lit === "" && !a.many && counts(a.subs[0]);
    if ((a.wild && !count) || a.many) refuse(`${name} with ${a.raw}, expanded outside double quotes: its value could turn out to be an operator; quote it`);
    for (const v of a.loose) ctx.wants.push({ name: v, need: "number", what: `${name} … $${v}, outside double quotes` });
    if (!a.dynamic && (a.lit === "-v" || a.lit === "-R")) refuse(`${name} ${a.lit}; in bash -v evaluates what follows it`);
  }
  if (!args.some((a) => a.dynamic)) return;
  const is = (a, s) => a && !a.dynamic && a.lit === s;
  const among = (a, set) => a && !a.dynamic && set.has(a.lit);
  const two = (a) => a.length === 2 && (is(a[0], "!") || among(a[0], TEST_UNARY));
  const three = (a) => a.length === 3 && (among(a[1], TEST_BINARY) || (is(a[0], "!") && two(a.slice(1))));
  if (args.length === 1 || two(args) || three(args) || (args.length === 4 && is(args[0], "!") && three(args.slice(1)))) return;
  refuse(`${name} with a variable where bash could read it as an operator; write one test per [ ], with its operator written out ([ "$a" = x ] && [ -n "$b" ])`);
}

/** A variable the command sets (`var=…`, `read var`, `for var in`, `${var:=…}`), and what that gives it: `number`
 *  (digits, a `$(( ))`, a count) or `path` (written out, and starting as a path does), or neither. notReadOnly() asks
 *  at the end whether a variable something relied on is given only such values, everywhere it is set. */
function sets(ctx, name, how) {
  if (!OWN.test(name)) {
    refuse(`${name} set; a Command sets only names of its own, in lowercase (an uppercase name is the shell's or a program's: PATH, IFS, ENV, BASH_ENV and LD_PRELOAD change what its commands run)`);
  }
  ctx.setters.set(name, [...(ctx.setters.get(name) ?? []), how]);
}

/** Whether the inside of a `$( )` prints one number whatever it reads: one pipeline that ends in `wc -l` (or -c, -w,
 *  -m) with no file named. */
function counts(sub) {
  const tokens = scan(sub);
  if (tokens.some((t) => t.op && t.op !== "|")) return false;
  const last = tokens.slice(tokens.findLastIndex((t) => t.op) + 1);
  return last.length === 2 && last.every((t) => t.bare) && last[0].raw === "wc" && /^-[lcwm]$/.test(last[1].raw);
}

/** One simple command: `var=value` words, then a command that is on the list. */
function simple(words, functions, ctx, where) {
  let k = 0;
  for (; k < words.length; k++) {
    const w = words[k];
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(w.raw);
    if (!m) break;
    if (/^IFS=(?:''|"")?$/.test(w.raw) || LOCALE.test(w.raw)) continue; // no word splitting, and the C locale
    // A number: digits, one $(( )), or one $( … | wc -l ). A path: written out, and starting as one does.
    const value = w.raw.slice(m[0].length);
    const alone = w.lit === m[0] && w.kinds.length === 1;
    const number = /^("?)-?\d+\1$/.test(value) || (alone && (w.kinds[0] === "arith" || (w.kinds[0] === "sub" && counts(w.subs[0]))));
    sets(ctx, m[1], { number, path: !w.dynamic && PATHLIKE.test(w.lit.slice(m[0].length)) });
  }
  const [cmd, ...args] = words.slice(k);
  if (!cmd) return; // "n=$(…)" alone
  if (!cmd.bare) refuse(`${cmd.raw} where a command goes; a command is named plainly, not through quotes, a backslash or a variable`);
  const name = cmd.raw;
  if (functions.has(name) || BUILTINS.has(name)) return;
  if (name === "[" || name === "test") return tests(name, args, ctx);
  if (Object.hasOwn(HELD, name)) return HELD[name](args, ctx, where);
  if (!READS.has(name)) refuse(`${name}, which is not on the list of commands that only read (src/lib/command.mjs)`);
}

/**
 * A whole command, or the inside of a "$( )". `functions` holds the functions defined so far, which later commands may
 * call: their bodies are checked like everything else. A function counts only once the shell is sure to have it, so
 * the name can't fall through to a program: defined at the top of the Command (`top`), on its own between ";", with a
 * "{ }" body, not in a pipeline, a condition, a subshell or another function. `ctx` is the whole Command's: the
 * variables it sets and how (`setters`), and the places that rely on what a variable can hold (`wants`).
 */
function check(src, functions, top, ctx) {
  const tokens = scan(src);
  const isName = (t) => t && t.bare && NAME.test(t.raw);
  const defines = (k) => isName(tokens[k]) && tokens[k + 1]?.op === "(" && tokens[k + 2]?.op === ")";
  // What a word holds beside its text: the commands inside its "$( )" and backticks (a subshell, so what they define
  // stays in there), the variables its ${x:=…} set, and the ones its $(( )) read.
  const inside = (w) => {
    w.subs.forEach((s) => check(s, new Set(functions), false, ctx));
    w.sets.forEach((name) => sets(ctx, name, {}));
    w.nums.forEach((name) => ctx.wants.push({ name, need: "number", what: `$(( )) reading ${name}` }));
  };
  const aside = (t) => (redirect(t, ctx), inside(t.target));
  let depth = 0; // how many ( ), { }, if, while, until and for we are inside
  let parens = 0; // how many ( ) of those
  let defining = null; // the function whose body is being read
  for (let k = 0; k < tokens.length; ) {
    const t = tokens[k];
    if (t.op) {
      if (t.op === ";;") refuse("a case statement");
      const step = t.op === "(" ? 1 : t.op === ")" ? -1 : 0;
      depth += step;
      parens += step;
      if (parens < 0) refuse("a ) that closes nothing");
      k++; // the next word is where a command goes
    } else if (t.bare && RESERVED.has(t.raw)) {
      // Only as the first word of a command, which is where the shell reads these as its own: after a redirect
      // (">/dev/null }") the word is a command's name, and falls to simple() below with the redirect.
      if (["{", "if", "while", "until"].includes(t.raw)) depth++;
      else if (["}", "fi", "done"].includes(t.raw)) {
        // The shell stops at one that closes nothing; counted, it would make a later branch look like the top.
        if (--depth < 0) refuse(`a ${t.raw} that closes nothing`);
        if (depth === 0 && defining) {
          if (t.raw === "}" && (k + 1 === tokens.length || tokens[k + 1].op === ";")) functions.add(defining);
          defining = null;
        }
      }
      k++; // still where a command goes
    } else if (t.bare && t.raw === "for") {
      // "for f in a b; do": a name and a list, no command.
      if (!isName(tokens[k + 1])) refuse("a for without a plain name");
      const name = tokens[k + 1].raw;
      const list = [];
      depth++;
      for (k += 2; k < tokens.length && !tokens[k].op; k++) tokens[k].redirect ? aside(tokens[k]) : (inside(tokens[k]), list.push(tokens[k]));
      // Its values are paths, or numbers, when every word of the list is written out and is one.
      const written = (re) => list[0]?.bare && list[0].raw === "in" && list.length > 1 && list.slice(1).every((w) => !w.dynamic && re.test(w.lit));
      sets(ctx, name, { path: written(PATHLIKE), number: written(/^\d+$/) });
    } else if (defines(k)) {
      if (NOT_A_FUNCTION.has(t.raw)) refuse(`a function called ${t.raw}, which is a shell's own word or a command on this list; give it a name of its own`);
      const alone = top && depth === 0 && (k === 0 || tokens[k - 1].op === ";");
      if (alone && tokens[k + 3]?.bare && tokens[k + 3].raw === "{") defining = t.raw;
      k += 3;
    } else {
      const words = [];
      for (; k < tokens.length && !tokens[k].op; k++) {
        if (tokens[k].redirect) aside(tokens[k]);
        else inside(tokens[k]), words.push(tokens[k]);
      }
      simple(words, functions, ctx, { subshell: parens > 0 || !top });
    }
  }
  if (depth !== 0) refuse("a ( ), { }, if, while or for left open");
}

/**
 * What in `command` could write, run a program off the list or reach the network, as a phrase ("rm, which is not on
 * the list…"), or null when it only reads.
 */
export function notReadOnly(command) {
  try {
    const ctx = { setters: new Map(), wants: [] };
    check(command, new Set(), true, ctx);
    // What a variable can hold is known once every place that sets it has been read, wherever it is in the Command.
    for (const { name, need, what } of ctx.wants) {
      const how = ctx.setters.get(name) ?? [];
      if (how.length && how.every((h) => h[need])) continue;
      if (need === "number") {
        refuse(`${what}, which the Command does not set to a number everywhere it sets it (digits, a $(( )) or a $( … | wc -l )): bash evaluates such a value as an expression, and splits it into words`);
      }
      refuse(`${what}, where ${name} is not set only to names written out (${name}=src, or for ${name} in src test; …), so it could turn out to be an option or /dev/tcp/…`);
    }
    return null;
  } catch (e) {
    if (e instanceof Refusal) return e.message;
    throw e;
  }
}
