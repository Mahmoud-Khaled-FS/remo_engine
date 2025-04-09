import { Command } from '../../../src/engine/command';
import type { EngineContext } from '../../../src/engine/Context';
import { exec } from '../../../src/utils/childProcess';

class ShutdownCommand extends Command {
  async exec(ctx: EngineContext) {
    exec(`powershell shutdown /s`);
    ctx.text('Goodbye!');
  }
}

export default ShutdownCommand;
