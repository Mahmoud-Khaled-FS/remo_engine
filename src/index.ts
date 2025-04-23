import { readdirSync } from 'node:fs';
import type { Adapter } from './adapter/adapter';
import FileAdapter from './adapter/file';
import TelegramAdapter from './adapter/telegram';
import config from './config';
import { exit } from './utils/exit';
import path from 'node:path';
import { Engine } from './engine/engine';

async function loadPlugins(engine: Engine) {
  const pluginsDir = config.getKey('pluginsDir');
  const pluginsRegister: any = [];
  if (pluginsDir && Array.isArray(pluginsDir)) {
    for (const dir of pluginsDir) {
      const d = readdirSync(dir);
      for (const plugin of d) {
        const plugPath = path.resolve(dir, plugin);
        pluginsRegister.push(engine.registerPlugin(plugPath));
      }
    }
  }
  await Promise.all(pluginsRegister);
}

async function main(argv: string[]) {
  await config.init('./config.json'); // TODO (MAHMOUD) - Parse command line argument!

  if (argv.length < 3) {
    exit('There is no command! Usage: remo run <file>');
  }

  // Easy to setup different plugins based on adapter
  const engine = new Engine();

  await loadPlugins(engine);

  let adapter: Adapter;
  switch (argv[2]) {
    case 'file': {
      adapter = new FileAdapter(engine, argv.slice(3));
      break;
    }
    case 'telegram': {
      adapter = new TelegramAdapter(engine, argv.slice(3));
      break;
    }
    default: {
      exit('Unknown command! Usage: remo run <file>');
    }
  }

  await adapter.run();
}

main(process.argv);
