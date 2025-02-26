import { Plugin, type PluginInitializer } from '../../engine/plugin';
import { info } from '../../utils/logger';
import AddPlaylistCommand from './commands/add_playlist';
import SuggestMusicCommand from './commands/suggest_music';

class MusicPlugin extends Plugin {
  init(): PluginInitializer {
    info('Music plugin init!');
    this.addCommand('suggest music', new SuggestMusicCommand());
    this.addCommand('add playlist', new AddPlaylistCommand());
    return {
      name: 'music',
    };
  }
}

export default MusicPlugin;
