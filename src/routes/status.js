import consoleMessage from "../utils/consoleMessage.js";
import { COLLECTION_1 } from "../config/constants.js";
import db from "../config/database.js";
import express from "express";

const route = express.Router();

route.post("/", async (req, res) => {
  const user = req.get("user");
  try {
    const userData = await db.collection(COLLECTION_1).findOne({ name: user });
    if (!userData) return res.sendStatus(404);
    const now = Date.now();
    await db
      .collection(COLLECTION_1)
      .updateOne({ name: userData.name }, { $set: { lastStatus: now } });
    res.sendStatus(200);
    consoleMessage("green", user, `updated status to`, now);
  } catch (error) {
    console.log(error);
  }
});

export default route;
