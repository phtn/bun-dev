import chalk from "chalk";
import { ESLint } from "eslint";
import ora from "ora";

const eslint = new ESLint({
  overrideConfigFile: "eslint.config.mjs", // optional: ESLint will auto-detect if present
});

const startTime = Date.now();

console.clear("Linting...");
const indicator = ora(" ", {
  spinner: "sand",
});
// indicator.spinner = "sand";
indicator.start();

const results = await eslint.lintFiles(["."]);
const formatter = await eslint.loadFormatter("stylish");
const resultText = formatter.format(results);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

const hasIssues = results.some((r) => r.errorCount > 0 || r.warningCount > 0);

const check = chalk.hex("#10B981").bold(" ✔ ");
const warnings = chalk.hex("#F5F5F5")("warnings");
const errors = chalk.hex("#F5F5F5")("errors");
const es = chalk.hex("#A5B4FC").bold(" eslint ");
const or = chalk.hex("#6B7280").bold(" or ");
const perfect = chalk.hex("#10B981").bold("100%");
const spice = chalk.hex("#f9a8d4").bold(" code's clean daddy!");
const teen = `${spice}`;
const took = chalk.hex("#FCE7F3").bold(`done in ${elapsed}s`);
const proper = `${es} ${perfect} `;

if (hasIssues) {
  console.log(resultText);
  console.log(chalk.hex("#F59E42").bold(`\nElapsed: ${elapsed}s`));
  process.exit(1);
} else {
  console.clear();
  console.log(`\n${check}${proper} - ${took}\n`);
  process.exit(0);
}

// ev:QkTC:2FVb/dM+f38gd+dt:AiX0iLPyMqx9HkFmJngMh2XL2oT8HezxKhKs8liMcd3o:kyE8cLlw+EuuhVqYrudum8PzY2e3LQN3MXhn+7bCUS6oEkusa1Le:$
// ev:QkTC:1LyjU2LufCgPJRiA:AtvgmqJtxTMwtAZOs5EDnXRRpVmEToFUbM6E5VaoDn8p:P/K7sGJ7dWC1wzFQTrRgiY+TP4zMwkKePZXqeEnYQ++2B99/P1Kg:$
