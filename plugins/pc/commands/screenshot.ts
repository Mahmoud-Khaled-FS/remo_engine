import * as os from 'os';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Command } from '../../../src/engine/command';
import type { EngineContext } from '../../../src/engine/Context';
import { exec } from '../../../src/utils/childProcess';

class ScreenshotCommand extends Command {
  async exec(ctx: EngineContext) {
    const path = join(os.tmpdir(), 'screenshot.png');
    await exec(`powershell nircmd savescreenshot ${path}`);
    await ctx.file(path, 'image');
    await unlink(path);
    return;
  }
}

export default ScreenshotCommand;
