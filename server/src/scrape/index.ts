import 'dotenv/config';
import { performance } from 'perf_hooks';
import * as cluster from 'cluster';
import { cpus } from 'os';

import { logger } from '../logger';
import { playerTag, battleLog } from '../mutation';

process.stdin.setEncoding('utf-8');

const tags = [
  // '#2YR0YURJV',
  '#8PGJJQCL8',
  '#C0CRVQUY',
  '#8VLUUP88',
  '#8LJ2C08RJ',
  '#9UJVG0J8J',
  '#82QVG02U',
  '#2PLJUQQVY',
  '#8U00GYJP',
];

const numCPUs = cpus().length;

const n = (a, b, i) => {
  const tag = a.values().next().value;
  logger.info(`[${i}]: Scrapping ${tag}`);
  if (!tag) {
    logger.info(`[${i}]: All player tags scraped. Impossible`);
    process.exit(0);
  }
  scrapePlayerWithBattles(String(tag))
    .then(({ players }) => {
      logger.info(
        `[${i}]: Scraped battles, Found ${players.length} new players`
      );
      players.forEach(p => {
        a.add(p.tag);
      });
      a.delete(tag);
      b.add(tag);
      n(a, b, i);
    })
    .catch(() => process.exit(0));
};

if (cluster.isMaster) {
  process.on('SIGINT', function() {
    logger.warn('Caught interrupt signal');
    process.exit();
  });
  logger.info(`This machine has ${numCPUs} cpus.`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork().send({ tag: tags.pop(), i });
  }
  cluster.on('online', worker => {
    logger.info(`Worker ${worker.process.pid} online!`);
  });
  cluster.on('exit', (worker, code, signal) => {
    logger.error(
      `Worker ${
        worker.process.pid
      } died with code: ${code} and signal: ${signal}`
    );
  });
} else if (cluster.isWorker) {
  process.on('message', ({ tag, i }) => {
    n(new Set([tag]), new Set(), i);
  });
} else {
  logger.warn(`I'm a ghost`);
}

const scrapePlayerWithBattles = async (tag: string) => {
  const start = performance.now();
  const result = await playerTag(undefined, { tag }, undefined);
  if (result instanceof Error) {
    logger.error(result);
  }
  const r2 = await battleLog(undefined, { playerTag: tag }, undefined);
  if (r2 instanceof Error) {
    logger.error(r2);
    process.exit(0);
  }
  const end = performance.now();
  const s = Math.floor(end - start) / 1000;
  logger.info(`battleLog(${tag}) in ${s}s`);
  const { battles, players, clanTags } = r2;
  return { battles, players, clanTags };
};
