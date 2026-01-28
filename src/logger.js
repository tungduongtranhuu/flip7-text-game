import fs from "fs";
import path from "path";

const LOG_FILE = "./logs/game-log.json";

export class Logger {
  constructor() {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
  }

  log(entry) {
    const data = JSON.parse(fs.readFileSync(LOG_FILE));
    data.push({
      time: new Date().toISOString(),
      ...entry
    });
    fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2));
  }
}
