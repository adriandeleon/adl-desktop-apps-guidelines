// Every rule of this edition as data (src/lib/llms.mjs).
import { rulesJson } from "../lib/llms.mjs";

export const GET = () =>
  new Response(JSON.stringify(rulesJson(), null, 2) + "\n", { headers: { "Content-Type": "application/json; charset=utf-8" } });
