import * as pino from 'pino';

export const logger = pino({
  level: 'debug',
  prettyPrint: { colorize: true, ignore: 'time,hostname' },
});
