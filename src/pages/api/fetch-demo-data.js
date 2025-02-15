import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const logDirectory = '/var/log/incoming_requests/2025-02';
  const logFiles = fs.readdirSync(logDirectory);

  const demoData = logFiles.map((logFile) => {
    const logFilePath = path.join(logDirectory, logFile);
    const content = fs.readFileSync(logFilePath, 'utf8');
    return {
      title: logFile.replace(/_log\.txt$/, ''),
      content,
    };
  });

  res.status(200).json({ demoData });
}