import { DB_PARTICIPANTS, DB_MESSAGES } from "../config/database.js";
import createStatusMessage from "../utils/createStatusMessage.js";
import consoleMessage from "./consoleMessage.js";

const TIME_LIMIT = 10000;

export default async function removeIdleUsers() {
  try {
    const query = { lastStatus: { $lt: Date.now() - TIME_LIMIT } };
    const users = await DB_PARTICIPANTS.find(query).toArray();
    const ids = users.map((u) => u._id);
    const exitMessages = users.map((u) => createStatusMessage(u.name, "exit"));
    const res = await DB_PARTICIPANTS.deleteMany({ _id: { $in: ids } });
    consoleMessage("red", "deleted", "from database:", `${res.deletedCount}`);
    if (exitMessages.length === 0) return;
    DB_MESSAGES.insertMany(exitMessages, { ordered: true });
  } catch (err) {
    throw err;
  }
}
