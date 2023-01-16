import { DATABASE_URL } from "./variables.js";
import { MongoClient } from "mongodb";
import chalk from "chalk";

const mongoClient = new MongoClient(DATABASE_URL);
const db = mongoClient.db();

try {
  process.stdout.write("Verifying connection... ");
  await db.command({ ping: 1 });
  console.log(chalk.bgGreen.bold(" OK "));
} catch (err) {
  console.log(chalk.bgRed.bold(" ERROR "));
  throw err;
}

const COLLECTIONS = ["participants", "messages"].map((c) => db.collection(c));

export const [DB_PARTICIPANTS, DB_MESSAGES] = COLLECTIONS;
