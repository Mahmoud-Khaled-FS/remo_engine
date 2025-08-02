import { Command, type Args } from '@src/engine/command';
import type Context from '@src/engine/Context';
import { exec } from '@src/utils/childProcess';
import { z } from 'zod';

type DownloadArgs = {
  url: string;
  path?: string;
};

class DownloadCommand extends Command<DownloadArgs> {
  constructor() {
    super();
  }
  args: Args = [
    {
      name: 'url',
      validation: z.string().url(),
      description: 'The URL to download',
    },
    {
      name: 'path',
      validation: z.string().optional(),
      description: 'The path to save the file',
    },
  ];

  async exec(ctx: Context, args: DownloadArgs): Promise<void> {
    ctx.io.text('Downloading...');
    // await exec('wget ' + process.cwd() + '/tmp ' + args.url);
    ctx.io.text('Done!');
  }
}

export default DownloadCommand;
