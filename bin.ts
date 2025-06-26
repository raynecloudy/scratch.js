#! /usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { createInterface } from "node:readline/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

(async () => {

  const argv = await yargs(hideBin(process.argv)).argv;

  process.stdout.write("\x1b[0m");

  if (argv._.length === 0) {
    console.log("\x1b[1mscratch.js CLI\x1b[0m");
    console.log();
    console.log("Commands:");
    console.log("   create   Create a new scratch.js project");
    console.log();
    console.log("Mrow!");
    console.log("=^..^=");
  } else if (argv._[0].toString() === "create") {
    console.log("This is the scratch.js project creation utility.");
    console.log("Press ^C at any time to abort.");
    console.log();
    const asker = createInterface(process.stdin, process.stdout);
    try {
      const answers = [
        await asker.question("name: "),
        await asker.question("edition: ")
      ];
      const dir = join(cwd(), answers[0]);
      mkdirSync(dir);
      writeFileSync(join(dir, "sbconfig.json"), `{
\t"name": "${answers[0]}",
\t"edition": "${answers[1]}"
}
`);
    } catch (error) {
      if (error.code === "ABORT_ERR") {
        console.error("\x1b[31mAborted.\x1b[0m");
      } else throw error;
    }
    asker.close();
  }

  process.stdout.write("\x1b[0m");

})();
