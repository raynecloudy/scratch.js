#! /usr/bin/env node

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
  }

  process.stdout.write("\x1b[0m");

})();
