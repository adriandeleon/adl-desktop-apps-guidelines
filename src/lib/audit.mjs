// The one audit report format (Coding agents and LLMs, "Audit an app"): the statuses an audit gives a rule and the JSON
// Schema of the report, served per edition as audit.schema.json and rules.schema.json (src/pages/), named in rules.json
// and llms.txt, and used by the pauta-audit skill (skills/pauta-audit/SKILL.md).

/** Every status a rule can get, in report order. The four exception kinds are pauta.json's (Conformance, PAUTA-09). */
export const STATUSES = {
  fail: "Not met, and pauta.json records no exception for it. A finding; a failed MUST blocks a release.",
  manual: "Checked by hand: source can't settle it, so a person checks it in the running app.",
  pending: "Not met; pauta.json records it as pending, with an issue.",
  deviation: "A SHOULD the app does differently on purpose; pauta.json records it, with a decision record.",
  "not-applicable": "The rule reads as applying to every app, but its subject does not exist in this one; pauta.json records it.",
  "app-only": "A template only: the rule needs what each app made from it has of its own; pauta.json records it.",
  limited: "The rule covers only apps with a feature this one lacks (its text, its page's or section's appliesTo, or the rule it details says so). Needs no exception.",
  pass: "Met.",
};

const VERSION = "^\\d+\\.\\d+\\.\\d+$";
const ID = "^[A-Z]{2,6}-\\d{2,3}$";

export function auditSchema(base) {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${base}audit.schema.json`,
    title: "Pauta audit report",
    description:
      "One app audited against one edition of Pauta: a result for every rule in scope. Written as docs/pauta-audit.json beside docs/pauta-audit.md.",
    type: "object",
    required: ["app", "commit", "edition", "date", "scope", "results"],
    additionalProperties: false,
    properties: {
      $schema: { type: "string", format: "uri" },
      app: { type: "string", description: "The app's name." },
      commit: { type: "string", description: "The commit audited, as a short or full SHA." },
      edition: { type: "string", pattern: VERSION, description: "The edition audited against." },
      appEdition: {
        type: ["string", "null"],
        pattern: VERSION,
        description: "The edition the app names (pauta.version), when it is not `edition`: one with no rules.json, or none at all (null).",
      },
      date: { type: "string", format: "date" },
      scope: {
        type: "array",
        items: { type: "string" },
        description: "What was audited: empty for every rule, else the prefixes, page slugs or rule IDs given.",
      },
      rules: { type: "string", description: "Where the rules came from: the edition's rules.json URL or a local path." },
      results: {
        type: "array",
        description: "One result per rule in scope, in the edition's rule order.",
        items: {
          type: "object",
          required: ["id", "level", "status", "evidence"],
          additionalProperties: false,
          properties: {
            id: { type: "string", pattern: ID },
            level: { enum: ["MUST", "SHOULD", "MAY"] },
            status: { enum: Object.keys(STATUSES), description: "See rules.json's `statuses`." },
            evidence: {
              type: "string",
              minLength: 1,
              description:
                "Where the verdict comes from, as path/File.java:123 from the repository root, and what is missing for a fail. For an exception, its pauta.json reason; for limited, the feature the app lacks.",
            },
            problem: {
              type: "string",
              description:
                "What is wrong with the app's pauta.json about this rule: an entry for a rule that passes or is limited, a deviation on a MUST, a deviation or pending entry with no link, or a level or url that differs from the edition's.",
            },
          },
        },
      },
      problems: {
        type: "array",
        items: { type: "string" },
        description: "Findings no rule of the edition holds: a pauta.json entry for a retired or unknown ID, an edition named differently in pom.xml and the README.",
      },
    },
  };
}

const text = { type: ["string", "null"] };

export function rulesSchema(base) {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${base}rules.schema.json`,
    title: "Pauta rules",
    description: "Every rule of one edition of Pauta, as rules.json serves it.",
    type: "object",
    required: ["name", "edition", "date", "url", "levels", "checks", "statuses", "pages", "rules", "retired"],
    properties: {
      $schema: { type: "string", format: "uri" },
      name: { const: "Pauta" },
      edition: { type: "string", pattern: VERSION },
      date: { type: "string", format: "date" },
      url: { type: "string", format: "uri", description: "The edition's address; every URL in the file is under it." },
      next: {
        type: "string",
        description: "Only in next/: the rules waiting for the edition after `edition`, not an edition themselves. Never cite them or audit against them.",
      },
      levels: { type: "object", additionalProperties: { type: "string" }, description: "MUST, SHOULD and MAY, and what each means." },
      checks: { type: "object", additionalProperties: { type: "string" }, description: "code, test and by hand, and how each is verified." },
      statuses: { type: "object", additionalProperties: { type: "string" }, description: "What an audit reports for a rule (audit.schema.json)." },
      audit: { type: "string", format: "uri", description: "The audit report's JSON Schema." },
      pages: {
        type: "array",
        description: "Every page, in reading order.",
        items: {
          type: "object",
          required: ["slug", "title", "prefix", "url", "markdown", "description", "appliesTo", "rules"],
          properties: {
            slug: { type: "string" },
            title: { type: "string" },
            prefix: text,
            url: { type: "string", format: "uri" },
            markdown: { type: "string", format: "uri", description: "The page as Markdown: its prose, rules and spec tables." },
            description: { type: "string" },
            appliesTo: { ...text, description: "The apps every rule on the page covers, when not every app." },
            rules: { type: "integer" },
          },
        },
      },
      rules: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "level", "page", "pageTitle", "section", "appliesTo", "url", "text", "why", "check", "reference"],
          properties: {
            id: { type: "string", pattern: ID },
            level: { enum: ["MUST", "SHOULD", "MAY"] },
            page: { type: "string" },
            pageTitle: { type: "string" },
            section: { ...text, description: "The page's H2 the rule is under, or null above the first one." },
            appliesTo: {
              ...text,
              description: "Its page's or section's limit, when it has one. The rule's own text can limit it too (PAUTA-05).",
            },
            url: { type: "string", format: "uri" },
            text: { type: "string" },
            why: text,
            check: {
              type: "object",
              required: ["kind", "text"],
              properties: {
                kind: { enum: ["code", "test", "by hand"] },
                text: { type: "string" },
                command: {
                  ...text,
                  description:
                    "For some code checks: one read-only POSIX shell command. Run it with sh -c from the app's repository root. Exit 0: the check passes; still read the rest of the rule and cite the file:line that meets it. Any other exit: the check fails, and what it printed is the evidence.",
                },
              },
            },
            reference: { type: "string" },
          },
        },
      },
      retired: {
        type: "array",
        description: "IDs no longer in use, never reused.",
        items: {
          type: "object",
          required: ["id", "edition", "see", "seeUrl"],
          properties: {
            id: { type: "string", pattern: ID },
            edition: { type: "string", pattern: VERSION, description: "The edition that retired it." },
            see: { ...text, description: "The rule that holds its requirement now." },
            seeUrl: text,
          },
        },
      },
    },
  };
}
