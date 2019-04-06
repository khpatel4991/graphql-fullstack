import * as split from 'split2';
import * as pump from 'pump';
import * as through from 'through2';
import * as chalk from 'chalk';

// import { logger } from '../logger';

const c = chalk.default;

const myTransport = through.obj(function(chunk, _, cb) {
  const pl = /FATAL|ERROR|WARN|INFO|DEBUG/.test(chunk.toString().slice(0, 10));
  if (pl) {
    console.log(c.blue(chunk));
  }
  cb();
});

pump(process.stdin, split(), myTransport);
