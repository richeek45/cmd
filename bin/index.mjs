#! /usr/bin/env node
import yargs_ from "yargs";
import { parseSentence, showHelp, showAll, parseLanguages, errorLog, parseArguments } from "./utils.mjs";
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk';  
import boxen from 'boxen';
import { translate } from '@vitalets/google-translate-api';
import readline from "readline";
import { JSONPreset, JSONFileSync } from "lowdb/node";
import { Low } from "lowdb";
import { commands } from "./constants.mjs";
import path from "path";
import { fileURLToPath } from 'url';


const defaultData = {todos: []}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');
const adapter = new JSONFileSync(dbPath);
export const db = new Low(adapter, defaultData);
await db.read()
await db.write()
const yargs = yargs_(hideBin(process.argv))
const usage = "\nUsage: tran <lang_name> sentence to be translated  for this particular session";
const optionParam = { alias: "languages", describe: "List all supported languages.", type: "boolean", demandOption: false }
// const options = yargs.usage(usage).option("l", optionParam).help(true).argv;
const sentence = parseSentence(yargs.argv._)
console.log(yargs.argv)


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});
readline.emitKeypressEvents(process.stdin);
if(process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const getArguments = () => {
  if(yargs.argv._[0] === undefined) {
    showHelp();
    return;
  }

  if(yargs.argv._.length > 1) {
    errorLog(`Only one argument can be accepted!`);
    showHelp();
    return;
  }

  parseArguments(yargs.argv._[0]);
  
  if(yargs.argv.l === true || yargs.argv.languages === true) {
    showAll();
  }
}

let language;
export const setLanguage = () => {
  if(yargs.argv._[0]) {
    language = yargs.argv._[0].toLowerCase()
    language = parseLanguages(language)
  }
  
  if (sentence === "") {
    console.error("\nThe entered sentence is like John Cena, I can't see it!\n")  
    console.log("Enter tran --help to get started.\n")  
  } 
}

export const getTranslation = () => {
  if(sentence) {
    translate(sentence, {to: language})
    .then(res => {
      console.log("\n" + boxen(chalk.green("\n" + res.text + "\n"), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");
    })
    .catch(err => {                            
        console.error(err);  
    });
  }
}

export const init = () => {
  getArguments();
  // setLanguage();
  // getTranslation();

}

init();
