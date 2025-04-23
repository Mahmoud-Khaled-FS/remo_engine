import { z } from 'zod';
import { Command, type Args } from '@src/engine/command';
import { exec } from '@src/utils/childProcess';
import config from '@src/config';
import type Context from '@src/engine/Context';

type DownloadArgs = {
  url: string;
  audioOnly?: string;
  redirect?: string;
};

class DownloadCommand extends Command<DownloadArgs> {
  private readonly YT_PATH: string;
  constructor() {
    super();
    this.YT_PATH = config.getPluginConfig<{ ytPath: string }>('downloader').ytPath;
  }
  args: Args = [
    {
      name: 'url',
      validation: z.string().url(),
      description: 'The URL to download',
    },
    {
      name: 'audioOnly',
      validation: z.enum(['true', 'false']).optional().default('false'),
      description: 'Download only audio file',
    },
    {
      name: 'redirect',
      validation: z.enum(['true', 'false']).optional().default('false'),
      description: 'Return back the file after download',
    },
  ];

  async exec(ctx: Context, args: DownloadArgs): Promise<void> {
    ctx.io.text('Downloading...');
    if (args.audioOnly === 'true') {
      console.log(`${this.YT_PATH} -P ${process.cwd()} -x "${args.url}"`);
      await exec(`${this.YT_PATH} -P ${process.cwd()} -x "${args.url}"`);
    } else {
      await exec(`${this.YT_PATH} -P ${process.cwd()} "${args.url}"`);
    }
    ctx.io.text('Done!');
  }
}

export default DownloadCommand;
