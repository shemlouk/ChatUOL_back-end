import { DATABASE_URL } from "./variables.js";
import { MongoClient } from "mongodb";
import chalk from "chalk";

const mongoClient = new MongoClient(DATABASE_URL);
const DB = [];

try {
  console.log(`Connecting to database...`);
  await mongoClient.connect();
  DB.push(mongoClient.db());
  console.log(chalk.white.bgGreen.bold(` Connected! `));
} catch (error) {
  console.log(chalk.red(error));
}

const [db] = DB;

export default db;
