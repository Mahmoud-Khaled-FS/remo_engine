import { Plugin, type PluginInitializer } from '../../src/engine/plugin';
import { type EngineArgument } from '../../src/engine/command';
import { info } from '../../src/utils/logger';

class EchoPlugin extends Plugin {
  init(): PluginInitializer {
    info('Echo plugin init!');
    this.addCommand('print', {
      help() {
        return 'Print the message';
      },
      validateArgs(args: EngineArgument[]) {
        if (args.length < 1) {
          throw new Error('invalid arguments');
        }
        if (args[0].name && args[0].name !== 'text') {
          throw new Error('Invalid args');
        }
        return { text: args[0].value };
      },
      exec(args: { text: string }) {
        return args.text;
      },
    });
    return {
      name: 'echo',
    };
  }
}

export default EchoPlugin;
