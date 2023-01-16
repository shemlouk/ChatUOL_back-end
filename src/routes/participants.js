import { DB_PARTICIPANTS, DB_MESSAGES } from "../config/database.js";
import createStatusMessage from "../utils/createStatusMessage.js";
import consoleMessage from "../utils/consoleMessage.js";
import express from "express";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
});

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  if (schema.validate(data).error) return res.sendStatus(422);
  try {
    const nameAlreadyExists = await DB_PARTICIPANTS.findOne(data);
    if (nameAlreadyExists) return res.sendStatus(409);
    data.lastStatus = Date.now();
    DB_PARTICIPANTS.insertOne(data);
    DB_MESSAGES.insertOne(createStatusMessage(data.name, "entry"));
    res.sendStatus(201);
    consoleMessage("yellow", data.name, "added to database as", "participant");
  } catch (err) {
    throw err;
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await DB_PARTICIPANTS.find().toArray();
    res.status(200).send(users);
  } catch (err) {
    throw err;
  }
});

export default router;
