import dayjs from "dayjs";
import Joi from "joi";

const schema = Joi.string().valid("entry", "exit").required();

export default function createStatusMessage(name, status) {
  if (schema.validate(status).error || !name) return;
  return {
    from: name,
    to: "Todos",
    text: status === "entry" ? "entra na sala..." : "sai da sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  };
}
