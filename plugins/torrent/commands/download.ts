import { Command, type Args } from '@src/engine/command';
import type Context from '@src/engine/Context';
import { exec } from '@src/utils/childProcess';
import { z } from 'zod';
import { join } from 'path'
import os from 'os'
import { spawn } from 'child_process';

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
    const url = new URL(args.url);
    let fileName = url.pathname.split('/').filter(Boolean).pop()!
    if (!fileName.endsWith('.torrent')) {
      fileName += '.torrent';
    }
    const downloadDir = args.path ?? join(os.homedir(), 'Download');
    const filePath = join(downloadDir, fileName);
    try {
      await exec(`wget -O ${filePath} ${args.url}`);
    } catch (error: any) {
      await ctx.io.text('❌ Download failed.');
    }

    await ctx.io.text(`Downloaded Torrent in path: ${filePath}`);

    await ctx.io.text('🚀 Starting torrent download...')
    try {

      // console.log(`transmission-cli -w "${downloadDir}" "${filePath}"`);
      const { stdout } = await exec(`aria2c --show-files "${filePath}"`);
      const lines = stdout.split('\n');
      let indexies = [];
      for (const line of lines) {
        if (line.includes('.mp4')) {
          console.log(line);
          const parts = line.trim().split('|');
          const index = parseInt(parts[0].trim(), 10);
          if (index > 0) {
            await ctx.io.text(parts[1].split('/').at(-1)!)
            indexies.push(index)
          }
        }
      }
      const args = [
        `--select-file=${indexies[0]}`,
        '-d', downloadDir,
        filePath,
      ];
      const aria2 = spawn('aria2c', args, { stdio: 'inherit' });
      aria2.on('close', async (code) => {
        if (code === 0) {
          await ctx.io.text('✅ MP4 download finished.');
        } else {
          await ctx.io.text(`❌ aria2c exited with code ${code}`);
        }
      });
    } catch (error: any) {
      console.log(error)
      await ctx.io.text('❌ Download torrent file failed.');
    }
  }
}

export default DownloadCommand;
