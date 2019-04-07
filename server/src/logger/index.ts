import * as pino from 'pino';

export const logger = pino({
  level: 'info',
  prettyPrint: { colorize: true, ignore: 'time,hostname' },
});
