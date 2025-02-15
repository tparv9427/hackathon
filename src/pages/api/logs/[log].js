import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { log } = req.query;
  const logPath = `/var/log/incoming_requests/2025-02/${log}_log.txt`;

  if (!fs.existsSync(logPath)) {
    return res.status(404).json({ error: "Log file not found" });
  }

  try {
    const content = fs.readFileSync(logPath, "utf8");
    res.status(200).json({ log, content });
  } catch (error) {
    res.status(500).json({ error: "Failed to read log file" });
  }
}
