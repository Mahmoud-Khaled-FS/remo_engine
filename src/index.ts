import Engine from './engine';
import { info } from './utils/logger';

async function main() {
  const engine = new Engine();
  await engine.registerPlugin('echo');
  const output = await engine.executeCommand(`remo echo print
    text=hello world
    `);
  info(`Command exec successfully! output: "${output}"`);
}

main();
