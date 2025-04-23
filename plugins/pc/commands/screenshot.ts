import * as os from 'os';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Command } from '@src/engine/command';
import { exec } from '@src/utils/childProcess';
import type Context from '@src/engine/Context';

class ScreenshotCommand extends Command {
  async exec(ctx: Context) {
    const path = join(os.tmpdir(), 'screenshot.png');
    await exec(`powershell nircmd savescreenshot ${path}`);
    await ctx.io.file(path, 'image');
    await unlink(path);
    return;
  }
}

export default ScreenshotCommand;
