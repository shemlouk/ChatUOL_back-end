import { COLLECTION_1 } from "../config/constants.js";
import consoleMessage from "./consoleMessage.js";
import db from "../config/database.js";

const TIME_LIMIT = 10000;

export default async function removeIdleUsers() {
  try {
    const users = await db.collection(COLLECTION_1).find().toArray();
    const filteredUsers = users
      .filter((u) => Date.now() - u.lastStatus >= TIME_LIMIT)
      .map((u) => u._id);
    const res = await db
      .collection(COLLECTION_1)
      .deleteMany({ _id: { $in: filteredUsers } });
    consoleMessage(
      "red",
      "(auto) deleted",
      "from database: ",
      `${res.deletedCount} users`
    );
  } catch (error) {
    console.log(error);
  }
}
