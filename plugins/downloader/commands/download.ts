import { z } from 'zod';
import { Command, type Args } from '@src/engine/command';
import type { EngineContext } from '@src/engine/Context';
import { exec } from '@src/utils/childProcess';
import { getPluginConfig } from '@src/config';

class DownloadCommand extends Command<{ url: string }> {
  private readonly YT_PATH: string;
  constructor() {
    super();
    this.YT_PATH = getPluginConfig('downloader').YT_PATH;
  }
  args: Args = [
    {
      name: 'url',
      validation: z.string().url(),
      description: 'The URL to download',
    },
  ];

  exec(ctx: EngineContext, args: { url: string }): void | Promise<void> {
    ctx.text('Downloading...');
    exec(`${this.YT_PATH} -P ${process.cwd()} "${args.url}"`);
  }
}

export default DownloadCommand;
