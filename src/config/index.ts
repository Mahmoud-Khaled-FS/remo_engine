// TODO (MAHMOUD) - load from config.json file

import { getStoragePath } from '@src/utils/storage';

const Config = {
  DEBUG: process.env.DEBUG === 'true' ? true : false,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'BOT_TOKEN',
  TELEGRAM_OWNER_ID: Number.parseInt(process.env.TELEGRAM_OWNER_ID || '0') || 0,
  plugins: {
    downloader: {
      YT_PATH: process.env.YT_PATH || 'yt-dlp',
    },
    queue: {
      savePath: getStoragePath('queue'),
    },
  },
} as const;

export function getPluginConfig<T extends keyof (typeof Config)['plugins']>(pluginName: T) {
  return Config.plugins[pluginName] as (typeof Config)['plugins'][T];
}

export default Config;
