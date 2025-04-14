import { Plugin } from '@src/engine/plugin';
import InfoCommand from './commands/info';
import ScreenshotCommand from './commands/screenshot';
import ShutdownCommand from './commands/shutdown';

class PcPlugin extends Plugin {
  name: string = 'pc';
  defaultCommand?: string | undefined = 'info';

  init(): void {
    this.addCommand('info', InfoCommand);
    this.addCommand('shutdown', ShutdownCommand);
    this.addCommand('screenshot', ScreenshotCommand);
  }
}

export default PcPlugin;
