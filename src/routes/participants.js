import { COLLECTION_1, COLLECTION_2 } from "../config/constants.js";
import createStatusMessage from "../utils/createStatusMessage.js";
import consoleMessage from "../utils/consoleMessage.js";
import db from "../config/database.js";
import express from "express";
import joi from "joi";

const schema = joi.object({
  name: joi.string().required(),
});

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const validation = schema.validate(data, { abortEarly: true });
  if (validation.error) return res.sendStatus(422);
  try {
    const nameAlreadyExists = await db.collection(COLLECTION_1).findOne(data);
    if (nameAlreadyExists) return res.sendStatus(409);
    data.lastStatus = Date.now();
    const message = createStatusMessage(data.name, "entry");
    db.collection(COLLECTION_1).insertOne(data);
    db.collection(COLLECTION_2).insertOne(message);
    res.status(201).send({ data, message });
    consoleMessage("yellow", data.name, "added to database as", "participant");
    console.log("Entry message sent to database");
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await db.collection(COLLECTION_1).find().toArray();
    res.status(200).send(participants);
  } catch (error) {
    console.log(error);
  }
});

export default router;
