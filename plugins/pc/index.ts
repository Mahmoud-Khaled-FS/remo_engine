import { Plugin, type PluginInitializer } from '../../src/engine/plugin';
import InfoCommand from './commands/info';
import ShutdownCommand from './commands/shutdown';

class PcPlugin extends Plugin {
  protected defaultCommand?: string | undefined = 'info';

  init(): PluginInitializer {
    this.addCommand('info', InfoCommand);
    this.addCommand('shutdown', ShutdownCommand);
    return {
      name: 'pc',
    };
  }
}

export default PcPlugin;
