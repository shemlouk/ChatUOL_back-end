import { DB_PARTICIPANTS, DB_MESSAGES } from "../config/database.js";
import consoleMessage from "../utils/consoleMessage.js";
import express from "express";
import dayjs from "dayjs";
import Joi from "joi";

const scheme = Joi.object({
  to: Joi.string().required(),
  text: Joi.string().required(),
  type: Joi.string().valid("message", "private_message").required(),
});

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const user = req.get("user");
  try {
    const userIsActive = await DB_PARTICIPANTS.findOne({ name: user });
    const dataIsInvalid = scheme.validate(data, { abortEarly: true }).error;
    if (dataIsInvalid || !userIsActive) return res.sendStatus(422);
    data.from = user;
    data.time = dayjs().format("HH:mm:ss");
    DB_MESSAGES.insertOne(data);
    res.status(201);
    consoleMessage("magenta", data.type, `added to database`, "");
  } catch (err) {
    throw err;
  }
});

router.get("/", async (req, res) => {
  const qLimit = req.query.limit;
  const user = req.get("user");
  if (!user || (!(Number(qLimit) > 0) && qLimit)) return res.sendStatus(422);
  try {
    const query = { $or: [{ from: user }, { to: user }, { to: "Todos" }] };
    const messages = await DB_MESSAGES.find(query).sort({ _id: -1 }).toArray();
    const limit = qLimit ? Number(qLimit) : messages.length;
    res.status(200).send(messages.slice(0, limit));
  } catch (err) {
    throw err;
  }
});

export default router;
