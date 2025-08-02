import { Plugin } from '@src/engine/plugin';

class DownloaderPlugin extends Plugin {
  name: string = 'torrent';
  defaultCommand?: string | undefined = 'download';
  init(): void {
    // this.addCommand('download', );
  }

  public async shouldLoad() {
    return true;
  }
}

export default DownloaderPlugin;
