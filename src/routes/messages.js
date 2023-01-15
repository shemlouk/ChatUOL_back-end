import { COLLECTION_1, COLLECTION_2 } from "../config/constants.js";
import consoleMessage from "../utils/consoleMessage.js";
import db from "../config/database.js";
import express from "express";
import dayjs from "dayjs";
import joi from "joi";

const scheme = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().valid("message", "private_message"),
});

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const user = req.get("user");
  const validation = scheme.validate(data, { abortEarly: true });
  const userIsLogged = await db
    .collection(COLLECTION_1)
    .findOne({ name: user });
  if (validation.error || !userIsLogged) return res.sendStatus(422);
  data.from = user;
  data.time = dayjs().format("HH:mm:ss");
  await db.collection(COLLECTION_2).insertOne(data);
  res.status(201).send(data);
  consoleMessage(
    "magenta",
    data.type,
    `added to database`,
    `from: ${data.from}`
  );
});

router.get("/", async (req, res) => {
  const query = Number(req.query.limit);
  const user = req.get("user");
  if (!user) return res.sendStatus(422);
  try {
    const messages = await db.collection(COLLECTION_2).find().toArray();
    const limit = query > 0 ? query : messages.length;
    const filteredMessages = messages.filter(
      (m) => m.from === user || m.to === user || m.to === "Todos"
    );
    res.status(200).send(filteredMessages.reverse().slice(0, limit));
  } catch (error) {
    console.log(error);
  }
});

export default router;
