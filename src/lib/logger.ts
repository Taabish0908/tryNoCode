import fs from 'fs';
import path from 'path';

export const logToFile = (message: string) => {
  const logPath = path.join(__dirname, '../../logs.txt');
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  
  fs.appendFileSync(logPath, logMessage);
};