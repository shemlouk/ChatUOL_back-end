import chalk from "chalk";

export default function consoleMessage(color, str1, str2, str3) {
  console.log(`${chalk[color].bold(str1)} ${str2} ${chalk.bold(str3)}`);
}
