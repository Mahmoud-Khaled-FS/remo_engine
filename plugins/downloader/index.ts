import { Plugin } from '@src/engine/plugin';
import DownloadCommand from './commands/download';
import { exec } from '@src/utils/childProcess';
import config from '@src/config';

class DownloaderPlugin extends Plugin {
  name: string = 'downloader';
  defaultCommand?: string | undefined = 'download';
  init(): void {
    this.addCommand('download', DownloadCommand);
  }

  public async shouldLoad() {
    const ytdlp = config.getPluginConfig<{ ytPath: string }>('downloader').ytPath;
    try {
      await exec(`${ytdlp} --version`);
      return true;
    } catch (e) {
      console.log('[DownloaderPlugin] yt-dlp not found, plugin will not be loaded.');
      return false;
    }
  }
}

export default DownloaderPlugin;
