import { Plugin, type PluginInitializer } from '../../src/engine/plugin';
import { Command, type Args, type EngineArgument } from '../../src/engine/command';
import { info } from '../../src/utils/logger';
import { z } from 'zod';

class EchoPlugin extends Plugin {
  init(): PluginInitializer {
    info('Echo plugin init!');
    this.addCommand('print', PrintCommand);
    return {
      name: 'echo',
    };
  }
}

export default EchoPlugin;

class PrintCommand extends Command<{
  text: string;
}> {
  args: Args = [
    {
      name: 'text',
      validation: z.string(),
      description: 'The message to print',
    },
  ];

  exec(args: { text: string }) {
    return args.text;
  }
}
