import Engine from './engine';
import { error, info } from './utils/logger';

async function main() {
  const engine = new Engine();
  await engine.registerPlugin('echo');
  if (process.argv.length < 3) {
    error('There is no remo file to execute!');
    return;
  }
  const commandFile = await Bun.file(process.argv[2]).text();

  const output = await engine.executeCommand(commandFile);
  info(`Command exec successfully! output: "${output}"`);
}

main();
