#!/usr/bin/env node
/**
 * Curriculum integrity check — run this before trusting any lesson count.
 *
 *   node scripts/verify-curriculum-integrity.mjs
 *
 * Asserts, against the live Supabase project:
 *   1. `curriculum_nodes` / `curriculum_phases` are reachable with the anon key.
 *   2. Node totals match `lib/curriculum-meta.ts` (CURRICULUM_META).
 *   3. Every node id matches `node-<prefix>-<lesson>`.
 *   4. Every module holds the same number of lessons and `order_index` is 1..N.
 *   5. Every `Lesson X.Y` title agrees with the numbering authority
 *      (`PREFIX_MODULE_MAP` in lib/curriculum-numbering.ts).
 *
 * Exits non-zero on the first violated invariant, so it is CI-safe.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing from .env.local");
    process.exit(1);
  }

  const metaSource = readFileSync(resolve(root, "lib/curriculum-meta.ts"), "utf8");
  const readMeta = (field) => {
    const match = metaSource.match(new RegExp(`${field}:\\s*(\\d+)`));
    if (!match) throw new Error(`CURRICULUM_META.${field} not found`);
    return Number(match[1]);
  };
  const expected = {
    modules: readMeta("modules"),
    perModule: readMeta("lessonsPerModule"),
    lessons: readMeta("totalLessons"),
  };

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const [phasesRes, nodesRes] = await Promise.all([
    fetch(`${url}/rest/v1/curriculum_phases?select=id,order_index,title&order=order_index`, { headers }),
    fetch(`${url}/rest/v1/curriculum_nodes?select=id,phase_id,title,order_index&order=order_index&limit=2000`, { headers }),
  ]);
  if (!phasesRes.ok || !nodesRes.ok) {
    console.error(`FAIL: REST request rejected (phases ${phasesRes.status}, nodes ${nodesRes.status})`);
    process.exit(1);
  }

  const phases = await phasesRes.json();
  const nodes = await nodesRes.json();
  const failures = [];
  const assert = (cond, message) => {
    if (!cond) failures.push(message);
  };

  assert(phases.length === expected.modules,
    `phases: expected ${expected.modules}, got ${phases.length}`);
  assert(nodes.length === expected.lessons,
    `nodes: expected ${expected.lessons}, got ${nodes.length}`);

  const byPhase = new Map();
  for (const node of nodes) {
    assert(/^node-\d+-\d+$/.test(node.id), `non-canonical node id: ${node.id}`);
    const list = byPhase.get(node.phase_id) ?? [];
    list.push(node);
    byPhase.set(node.phase_id, list);
  }

  for (const [phaseId, list] of byPhase) {
    assert(list.length === expected.perModule,
      `${phaseId}: expected ${expected.perModule} lessons, got ${list.length}`);
    const orders = list.map((n) => n.order_index).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        failures.push(`${phaseId}: order_index is not 1..${orders.length} (first gap at ${i + 1} → ${orders[i]})`);
        break;
      }
    }
  }

  // Numbering authority check: title "Lesson X.Y" must agree with the id.
  const mapBlockMatch = readFileSync(resolve(root, "lib/curriculum-numbering.ts"), "utf8")
    .match(/const PREFIX_MODULE_MAP[^=]*=\s*\{([\s\S]*?)\n\};/);
  const prefixToModule = new Map();
  if (mapBlockMatch) {
    for (const m of mapBlockMatch[1].matchAll(/(\d+):\s*\{\s*moduleNum:\s*(\d+)/g)) {
      prefixToModule.set(Number(m[1]), Number(m[2]));
    }
  }
  assert(prefixToModule.size > 0, "could not parse PREFIX_MODULE_MAP");

  for (const node of nodes) {
    const titleMatch = node.title.match(/Lesson\s+(\d+)\.(\d+)/i);
    if (!titleMatch) continue;
    const prefix = Number(node.id.split("-")[1]);
    const expectedModule = prefixToModule.get(prefix);
    if (expectedModule !== undefined && Number(titleMatch[1]) !== expectedModule) {
      failures.push(`title/module mismatch: ${node.id} is module ${expectedModule} but titled "Lesson ${titleMatch[1]}.${titleMatch[2]}"`);
    }
  }

  if (failures.length > 0) {
    console.error(`FAIL: ${failures.length} invariant(s) violated`);
    for (const failure of failures.slice(0, 40)) console.error(`  · ${failure}`);
    process.exit(1);
  }

  console.log(`PASS: ${phases.length} modules / ${nodes.length} lessons (${expected.perModule} per module), numbering consistent.`);
}

main().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
