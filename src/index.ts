import Engine from './engine';
import AppError from './utils/error';
import { error, info } from './utils/logger';

const DEBUG = true;

async function main() {
  try {
    const engine = new Engine();
    await engine.registerPlugin('echo');
    if (process.argv.length < 3) {
      error('There is no remo file to execute!');
      return;
    }
    const commandFile = await Bun.file(process.argv[2]).text();

    const output = await engine.executeCommand(commandFile);
    info(`Command exec successfully! output: "${output}"`);
  } catch (err) {
    if (err instanceof AppError) {
      if (err.shouldLog || DEBUG) {
        error(err.message);
      } else {
        error('Something went wrong!');
      }
    } else {
      if (DEBUG) {
        error(err);
      } else {
        error('Something went wrong!');
      }
    }
    process.exit(1);
  }
}

main();
