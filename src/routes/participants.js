import consoleMessage from "../utils/consoleMessage.js";
import db from "../config/database.js";
import express from "express";
import joi from "joi";

const schema = joi.object({
  name: joi.string().required(),
});

const COL = "participantes";
const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  const validation = schema.validate(body, { abortEarly: true });
  if (validation.error) return res.sendStatus(422);

  try {
    const nameAlreadyExists = await db.collection(COL).findOne(body);
    if (nameAlreadyExists) return res.sendStatus(409);

    body.lastStatus = Date.now();
    await db.collection(COL).insertOne(body);

    res.status(200).send(body);
    consoleMessage("yellow", body.name, "added to database as", "participant");
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await db.collection(COL).find().toArray();
    res.status(200).send(participants);
  } catch (error) {
    console.log(error);
  }
});

export default router;
