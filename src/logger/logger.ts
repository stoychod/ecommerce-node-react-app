import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} - ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "silly",
  format: combine(errors({ stack: true }), timestamp(), myFormat),
  transports: [
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        myFormat
      ),
    }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

export default logger;
