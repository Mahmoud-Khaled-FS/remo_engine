import type { Adapter } from './adapter/adapter';
import FileAdapter from './adapter/file';
import Engine from './engine';
import { exit } from './utils/exit';
import { error, info } from './utils/logger';

async function main(argv: string[]) {
  if (argv.length < 3) {
    exit('There is no command! Usage: remo run <file>');
  }

  // Easy to setup different plugins based on adapter
  const engine = new Engine();
  await engine.registerPlugin('echo');

  let adapter: Adapter;
  switch (argv[2]) {
    case 'run': {
      if (argv.length < 4) {
        exit('There is no remo file to execute!');
      }
      adapter = new FileAdapter(engine, argv.slice(3));
      break;
    }
    default: {
      error('Unknown command! Usage: remo run <file>');
      process.exit(1);
    }
  }

  await adapter.run();
}

main(process.argv);
