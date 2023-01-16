import { PORT } from "./config/variables.js";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import removeIdleUsers from "./utils/removeIdleUsers.js";
import participants from "./routes/participants.js";
import messages from "./routes/messages.js";
import status from "./routes/status.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/participants", participants);
app.use("/messages", messages);
app.use("/status", status);

app.listen(PORT, () => {
  console.log(chalk.blue(`Server is running`));
});

// setInterval(removeIdleUsers, 15000)