const winston = require("winston");

const { NODE_ENV } = process.env;

const debugMode = NODE_ENV === "development";

const errorStackFormat = winston.format(info => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

const winstonTransports = [
  new winston.transports.Console({
    level: debugMode ? "debug" : "error",
  }),
];

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.align(),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.simple(),
    errorStackFormat(),
    winston.format.printf(
      info => `[${info.timestamp}] ${info.level}: ${info.message} ${info.stack ? `\n${info.stack}` : ""}`,
    ),
  ),
  transports: winstonTransports,
});

module.exports = logger;
