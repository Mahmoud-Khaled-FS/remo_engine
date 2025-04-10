import { Plugin } from '../../src/engine/plugin';
import { Command, type Args } from '../../src/engine/command';
import type { EngineContext } from '../../src/engine/Context';

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
  async exec(ctx: EngineContext) {
    ctx.text('Urmom');
  }
}
