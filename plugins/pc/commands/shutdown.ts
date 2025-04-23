import { Command } from '@src/engine/command';
import type Context from '@src/engine/Context';
import { exec } from '@src/utils/childProcess';

class ShutdownCommand extends Command {
  async exec(ctx: Context) {
    exec(`powershell shutdown /s`);
    ctx.io.text('Goodbye!');
  }
}

export default ShutdownCommand;
