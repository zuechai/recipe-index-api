const winston = require("winston");

const { printf, errors, timestamp, combine, prettyPrint } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const serverLogFormat = printf(({ level, message, timestamp, stack }) => {
  const logFormat = `[${timestamp}] ${level.toLocaleUpperCase()}: ${message}`;
  if (process.env.NODE_ENV === "production") {
    return logFormat;
  }
  const stackMsg = stack === undefined ? "" : `STACK: ${stack}`;
  return `${logFormat} ${stackMsg}`;
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.NODE_ENV === "production" ? "info" : "trace",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    // serverLogFormat
    prettyPrint()
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
