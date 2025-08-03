import { Plugin } from '@src/engine/plugin';
import DownloadCommand from './commands/download';

class DownloaderPlugin extends Plugin {
  name: string = 'torrent';
  defaultCommand?: string | undefined = 'download';
  init(): void {
    this.addCommand('download', DownloadCommand);
  }

  public async shouldLoad() {
    return true;
  }
}

export default DownloaderPlugin;
