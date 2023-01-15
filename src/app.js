import { PORT } from "./config/variables.js";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import db from "./config/database.js";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(chalk.blue(`Server is running`));
});
