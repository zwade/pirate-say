import fs from "fs/promises";
import { Mutex } from "async-mutex";
import path from "path";

const logfileMutex = new Mutex();
const allowedMessagesPerMinute = 6;

const self = new URL(import.meta.url).pathname;
const logFile = path.join(self, "../../.history.json");
console.log(logFile);

export const CheckRateLimit = async (userId: string, message: string) => {
    return await logfileMutex.runExclusive(async () => {
        let history: Record<string, { timestamp: number; message: string }[]>;
        try {
            const logfile = await fs.readFile(logFile, "utf-8");
            history = JSON.parse(logfile) as typeof history;
        } catch (e) {
            console.info("No history file found, creating one");
            history = {};
        }

        if (!history[userId]) {
            history[userId] = [];
        }

        const now = Date.now();
        const messages = history[userId].filter((m) => m.timestamp > now - 60_000);

        if (messages.length >= allowedMessagesPerMinute) {
            return false;
        }

        history[userId].push({ timestamp: now, message });

        await fs.writeFile(logFile, JSON.stringify(history, null, 4), "utf-8");
        return true;
    });
}