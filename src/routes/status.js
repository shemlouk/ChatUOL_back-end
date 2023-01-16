import { DB_PARTICIPANTS } from "../config/database.js";
import express from "express";

const route = express.Router();

route.post("/", async (req, res) => {
  const user = req.get("user");
  try {
    const userData = await DB_PARTICIPANTS.findOne({ name: user });
    if (!userData) return res.sendStatus(404);
    DB_PARTICIPANTS.updateOne(
      { name: userData.name },
      { $set: { lastStatus: Date.now() } }
    );
    res.sendStatus(200);
  } catch (err) {
    throw err;
  }
});

export default route;
