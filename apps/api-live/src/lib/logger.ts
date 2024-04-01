import winston from 'winston';

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logger = winston.createLogger({
  levels: customLevels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info: winston.Logform.TransformableInfo) =>
        `[${info.timestamp}] ${info.level}: ${info.message}`
    ),
    winston.format.align(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    winston.format.timestamp()
  ),
  defaultMeta: { service: 'api-live' },
  transports: [new winston.transports.File({ filename: 'combined.log' })],
});

export default logger;
