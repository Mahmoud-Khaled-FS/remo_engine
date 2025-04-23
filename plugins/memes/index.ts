import { Plugin } from '@src/engine/plugin';
import { Command, type Args } from '@src/engine/command';
import type Context from '@src/engine/Context';

class MemesPlugin extends Plugin {
  name: string = 'memes';
  defaultCommand: string = 'urmom';

  init(): void {
    this.addCommand('urmom', UrmomCommand);
  }
}

export default MemesPlugin;

class UrmomCommand extends Command {
  args: Args = [];
  async exec(ctx: Context) {
    ctx.io.text('Urmom');
  }
}
