import { COLLECTION_1, COLLECTION_2 } from "../config/constants.js";
import createStatusMessage from "../utils/createStatusMessage.js";
import consoleMessage from "./consoleMessage.js";
import db from "../config/database.js";

const TIME_LIMIT = 10000;

export default async function removeIdleUsers() {
  try {
    const users = await db.collection(COLLECTION_1).find().toArray();
    const filteredUsers = users.filter(
      (u) => Date.now() - u.lastStatus >= TIME_LIMIT
    );
    const ids = filteredUsers.map((u) => u._id);
    const exitMessages = filteredUsers.map((u) =>
      createStatusMessage(u.name, "exit")
    );
    const res = await db
      .collection(COLLECTION_1)
      .deleteMany({ _id: { $in: ids } });
    if (exitMessages.length > 0) {
      db.collection(COLLECTION_2).insertMany(exitMessages, { ordered: true });
    }
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
