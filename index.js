#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchCatFact, makeSpeechBubble, CAT_ART } from "./lib.js";

// ── CLI argument parsing ────────────────────────────────────────────

const options = {
  help:    { type: "boolean", short: "h", default: false },
  version: { type: "boolean", short: "v", default: false },
  count:   { type: "string",  short: "n", default: "1" },
};

let args;
try {
  args = parseArgs({ options, strict: true });
} catch (err) {
  console.error(chalk.red(`Error: ${err.message}`));
  console.error('Run with --help for usage information.');
  process.exit(1);
}

if (args.values.help) {
  console.log(`
${chalk.bold("cat-facts")} - Random cat facts in your terminal

${chalk.yellow("USAGE")}
  cat-facts [options]

${chalk.yellow("OPTIONS")}
  -n, --count <number>   Number of cat facts to display (default: 1)
  -h, --help             Show this help message
  -v, --version          Show version number

${chalk.yellow("EXAMPLES")}
  cat-facts              Show one random cat fact
  cat-facts -n 3         Show three random cat facts
`);
  process.exit(0);
}

if (args.values.version) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
  console.log(pkg.version);
  process.exit(0);
}

const count = parseInt(args.values.count, 10);
if (isNaN(count) || count < 1) {
  console.error(chalk.red("Error: --count must be a positive integer."));
  process.exit(1);
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const banner = figlet.textSync("Cat Facts", { font: "Small" });
  console.log(chalk.cyan(banner));
  console.log();

  for (let i = 0; i < count; i++) {
    const fact = await fetchCatFact();

    const bubble = makeSpeechBubble(fact);
    console.log(chalk.white(bubble));
    console.log(chalk.yellow(CAT_ART));

    if (i < count - 1) {
      console.log(chalk.gray("\n" + "~".repeat(54) + "\n"));
    }
  }
}

main();
