import { Plugin } from '@src/engine/plugin';
import DownloadCommand from './commands/download';

class DownloaderPlugin extends Plugin {
  name: string = 'downloader';
  defaultCommand?: string | undefined = 'download';
  init(): void {
    this.addCommand('download', DownloadCommand);
  }
}

export default DownloaderPlugin;
