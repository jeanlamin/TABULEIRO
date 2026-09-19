#!/usr/bin/env node
// Enforces the architecture boundaries from the V1.71 brief:
//   - domain/ and application/ must not depend on Next.js or React.
//   - components/ must never talk to the database directly.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

function listFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) return listFiles(full);
    if ([".ts", ".tsx"].includes(extname(full))) return [full];
    return [];
  });
}

function importSpecifiers(source) {
  const specifiers = [];
  const importRe = /from\s+["']([^"']+)["']/g;
  const requireRe = /require\(\s*["']([^"']+)["']\s*\)/g;
  for (const re of [importRe, requireRe]) {
    for (const match of source.matchAll(re)) {
      specifiers.push(match[1]);
    }
  }
  return specifiers;
}

const rules = [
  {
    label: "domain/application must not depend on Next.js or React",
    dirs: ["domain", "application"],
    forbidden: (specifier) =>
      specifier === "react" ||
      specifier === "react-dom" ||
      specifier.startsWith("next") ||
      specifier.includes("/app/") ||
      specifier.includes("/components/"),
  },
  {
    label: "components must never write directly to the database",
    dirs: ["components"],
    forbidden: (specifier) =>
      specifier === "kysely" ||
      specifier === "pg" ||
      specifier === "@supabase/supabase-js" ||
      specifier === "@supabase/ssr" ||
      specifier.includes("infrastructure/db"),
  },
];

let violations = [];

for (const rule of rules) {
  for (const dir of rule.dirs) {
    for (const file of listFiles(join(ROOT, dir))) {
      const source = readFileSync(file, "utf8");
      for (const specifier of importSpecifiers(source)) {
        if (rule.forbidden(specifier)) {
          violations.push(`${file.replace(ROOT, "")}: imports "${specifier}" — ${rule.label}`);
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Architecture boundary violations:\n");
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log("Architecture boundaries OK.");
