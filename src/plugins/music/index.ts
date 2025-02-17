import type { Plugin, PluginInitializer } from '../../engine/plugin';
import { info } from '../../utils/logger';

class MusicPlugin implements Plugin {
  init(): PluginInitializer {
    info('Music plugin init!');
    return {
      name: 'music',
    };
  }
}

export default MusicPlugin;
