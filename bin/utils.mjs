import chalk from 'chalk';  
import boxen from 'boxen';
import { commandTypes } from './constants.mjs';
import readline from 'readline';
import { stdin as input, stdout as output } from 'node:process';
import { db } from './index.mjs';

// RxDB: Provides real-time reactivity, allowing developers to subscribe to database changes.
// NeDB: A lightweight, in-memory database.
// Keyv: A simple, key-value store.
// Appwrite: An open-source backend cloud platform.
// pg-mem: A PostgreSQL in-memory database.
// @databases: A collection of databases for JavaScript.
// Mongo Seeding: A tool for seeding MongoDB databases.
// Finale: A database for building web applications.


export function parseSentence(words) {
  if(!words || !words.length || !Array.isArray(words)) {
    return;
  }
  const sentence = words.reduce((prev, word, index) => {
    if(index > 0) {
      return prev + word
    }
    return prev
  }, "")
  return sentence;
} 

export function parseLanguages(language) {
  if (language.length == 2) {
    return language
  } 
  if (languages.has(language)) {
    return languages.get(language)
  } else {
    console.error("Language not supported!")
    return;
  }

}

const usage = chalk.hex("#83aaff")("/nUsage: tran <lang_name> sentence to be translated!")
export function showHelp() {
  console.log(usage);  
  console.log(`\nOptions:\r`)  
  console.log(`\t--version  Show version number.\t\t [boolean]\r`)  
  console.log(`-l, --languages\t   List all languages. \t\t [boolean]\r`)  
  console.log(`\tnew\t Use to create a new todo \r`)
  console.log(`\tget\t Use to retrive your todos \r`)  
  console.log(`\tcomplete\t Use to mark a todo as complete \r`)  
  console.log(`\t--help\t     Show help. \t\t [boolean]\n`)  
}

export function prompt(question) {
  const rl = readline.createInterface({ input, output, terminal: false });

  return new Promise((resolve, reject) => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    })
  })
}

export function newTodo() {
  const q = chalk.blue('What is your question?');
  prompt(q).then(todo => {
    db.data.todos.push({ title: todo, completed: false, id: db.data.todos.length});
    db.write();
  });
}

// TODO - move up and down with key and update the logs without logging again below 
export function getTodo() {
  const todos = db.data.todos;
  let index = 0;
  
  todos.forEach((todo, i) => {
    // if (i === index) {
    //   const task = chalk.green(`${i+1}. ${todo.title}`);
    //   console.log(task);
    // }
    // if (i !== index) {
    //   const task = chalk.blue(`${i+1}. ${todo.title}`);
    //   console.log(task);
    // }
    if (!todo.completed) {
      const task = chalk.blue(`${i+1}. ${todo.title}`);
      console.log(task);
    } else {
      const task = chalk.green(`${i+1}. ${todo.title}`);
      console.log(task);
    } 
  })

  process.stdin.on('keypress', (chunk, key) => {
    console.log(key, index)
    if (key.name === 'up' && index > 0) {
      index--;
    }
    if (key.name === 'down' && index < todos.length - 1) {
      index++;
    }
  })
}

export function completeTask() {
  const todos = db.data.todos;
  // parse string to number
  process.stdin.on('keypress', (chunk, key) => {
    const todoIndex = Number(key.name);
    const limit = todoIndex > 0 && todoIndex <= todos.length;
    if(typeof (todoIndex) === "number" && !isNaN(todoIndex) && limit) {
      todos[todoIndex-1].completed = true;
      db.write();
      console.log(Object.keys(key), key.name);
    } else if (!limits || (typeof(todoIndex) !== 'number')) {
      errorLog(`Enter a valid number!`)
    }
  }).on('close', () => {
    console.log('Process Exited~!');
    process.exit(0);
  })
}

export function parseArguments(arg) {
  switch(arg) {
    case commandTypes.NEW: {
      newTodo();
      break;
    }
    case commandTypes.GET: {
      getTodo();
      break;
    }
    case commandTypes.COMPLETE: {
      completeTask();
      break;
    }
    default: {
      errorLog(`invalid command passed!`);
      showHelp();
    }
  }

}

export function showAll() {
  console.log(chalk.magenta.bold("\nLanguage Name\t\tISO-639-1 Code\n"))
  for (let [key, value] of languages) {
    console.log(key,"\t\t",value,'\n')
  }
}

export function errorLog(error) {
  const eLog = chalk.red(error);
  console.log(eLog);
}


let languages = new Map()
languages.set('afrikaans', 'af')  
languages.set('albanian', 'sq')  
languages.set('amharic', 'am')  
languages.set('arabic', 'ar')  
languages.set('armenian', 'hy')  
languages.set('azerbaijani', 'az')  
languages.set('basque', 'eu')  
languages.set('belarusian', 'be')  
languages.set('bengali', 'bn')  
languages.set('bosnian', 'bs')  
languages.set('bulgarian', 'bg')  
languages.set('catalan', 'ca')  
languages.set('cebuano', 'ceb')   
languages.set('chinese', 'zh')   
languages.set('corsican', 'co')  
languages.set('croatian', 'hr')  
languages.set('czech', 'cs')  
languages.set('danish', 'da')  
languages.set('dutch', 'nl')  
languages.set('english', 'en')  
languages.set('esperanto', 'eo')  
languages.set('estonian', 'et')  
languages.set('finnish', 'fi')  
languages.set('french', 'fr')  
languages.set('frisian', 'fy')  
languages.set('galician', 'gl')  
languages.set('georgian', 'ka')  
languages.set('german', 'de')  
languages.set('greek', 'el')  
languages.set('gujarati', 'gu')  
languages.set('haitian creole', 'ht')  
languages.set('hausa', 'ha')  
languages.set('hawaiian', 'haw') // (iso-639-2)  
languages.set('hebrew', 'he') //or iw  
languages.set('hindi', 'hi')  
languages.set('hmong', 'hmn') //(iso-639-2)  
languages.set('hungarian', 'hu')  
languages.set('icelandic', 'is')  
languages.set('igbo', 'ig')  
languages.set('indonesian', 'id')  
languages.set('irish', 'ga')  
languages.set('italian', 'it')  
languages.set('japanese', 'ja')  
languages.set('javanese', 'jv')  
languages.set('kannada', 'kn')  
languages.set('kazakh', 'kk')  
languages.set('khmer', 'km')  
languages.set('kinyarwanda', 'rw')  
languages.set('korean', 'ko')  
languages.set('kurdish', 'ku')  
languages.set('kyrgyz', 'ky')  
languages.set('lao', 'lo')  
languages.set('latin', 'la')  
languages.set('latvian', 'lv')  
languages.set('lithuanian', 'lt')  
languages.set('luxembourgish', 'lb')  
languages.set('macedonian', 'mk')  
languages.set('malagasy', 'mg')  
languages.set('malay', 'ms')  
languages.set('malayalam', 'ml')  
languages.set('maltese', 'mt')  
languages.set('maori', 'mi')  
languages.set('marathi', 'mr')  
languages.set('mongolian', 'mn')  
languages.set('burmese', 'my')  
languages.set('nepali', 'ne')  
languages.set('norwegian', 'no')  
languages.set('nyanja', 'ny')  
languages.set('odia', 'or')  
languages.set('pashto', 'ps')  
languages.set('persian', 'fa')  
languages.set('polish', 'pl')  
languages.set('portuguese', 'pt')  
languages.set('punjabi', 'pa')  
languages.set('romanian', 'ro')  
languages.set('russian', 'ru')  
languages.set('samoan', 'sm')  
languages.set('scots',  'gd')//gd gaelic  
languages.set('serbian', 'sr')  
languages.set('sesotho', 'st')  
languages.set('shona', 'sn')  
languages.set('sindhi', 'sd')  
languages.set('sinhalese', 'si')  
languages.set('slovak', 'sk')  
languages.set('slovenian', 'sl')  
languages.set('somali', 'so')  
languages.set('spanish', 'es')  
languages.set('sundanese', 'su')  
languages.set('swahili', 'sw')  
languages.set('swedish', 'sv')  
languages.set('tagalog', 'tl')  
languages.set('tajik', 'tg')  
languages.set('tamil', 'ta')  
languages.set('tatar', 'tt')  
languages.set('telugu', 'te')  
languages.set('thai', 'th')  
languages.set('turkish', 'tr')  
languages.set('turkmen', 'tk')  
languages.set('ukrainian', 'uk')  
languages.set('urdu', 'ur')  
languages.set('uyghur', 'ug')  
languages.set('uzbek', 'uz')  
languages.set('vietnamese', 'vi')  
languages.set('welsh', 'cy')  
languages.set('xhosa', 'xh')  
languages.set('yiddish','yi')  
languages.set('yoruba', 'yo')  
languages.set('zulu',    'zu')