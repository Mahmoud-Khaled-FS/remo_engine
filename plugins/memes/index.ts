import { Plugin, type PluginInitializer } from '../../src/engine/plugin';
import { Command, type Args } from '../../src/engine/command';
import { info } from '../../src/utils/logger';

class MemesPlugin extends Plugin {
  defaultCommand: string = 'urmom';

  init(): PluginInitializer {
    this.addCommand('urmom', UrmomCommand);
    return {
      name: 'memes',
    };
  }
}

export default MemesPlugin;

class UrmomCommand extends Command {
  args: Args = [];
  exec() {
    return 'urmom';
  }
}
