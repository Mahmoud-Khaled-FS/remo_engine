// TODO (MAHMOUD) - load from config.json file

import { exit } from '@src/utils/exit';
import { getStoragePath } from '@src/utils/storage';
import { statSync } from 'node:fs';

// const Config = {
//   DEBUG: process.env.DEBUG === 'true' ? true : false,
//   TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'BOT_TOKEN',
//   TELEGRAM_OWNER_ID: Number.parseInt(process.env.TELEGRAM_OWNER_ID || '0') || 0,
//   plugins: {
//     downloader: {
//       YT_PATH: process.env.YT_PATH || 'yt-dlp',
//     },
//     queue: {
//       savePath: getStoragePath('queue'),
//     },
//   },
// } as const;

// export function getPluginConfig<T extends keyof (typeof Config)['plugins']>(pluginName: T) {
//   return Config.plugins[pluginName] as (typeof Config)['plugins'][T];
// }

class Config {
  private config: any = null;
  public async init(path: string) {
    try {
      const stat = statSync(path);
      if (!stat.isFile()) {
        exit('config path must be json file');
      }
      this.config = await Bun.file(path).json();
      this.replaceTemplateWithEnv(this.config);
    } catch (err: any) {
      if (err.errno) {
        exit('Can not find config file');
      }
      exit(err.message);
    }
  }

  getPluginConfig<T = unknown>(name: string): T {
    return this.config?.plugins?.[name];
  }

  getKey<T = unknown>(key: string): T {
    return this.config?.[key];
  }

  getAdapterConfig<T = unknown>(name: string): T {
    return this.config?.adapters?.[name];
  }

  private replaceTemplateWithEnv(config: any) {
    if (!config || typeof config !== 'object') {
      return;
    }
    for (const key of Object.keys(config)) {
      switch (typeof config[key]) {
        case 'string':
          {
            if (config[key].startsWith('%env.') && config[key].endsWith('%')) {
              config[key] = process.env[config[key].replace('%env.', '').replace('%', '')];
            }
          }
          break;
        case 'object': {
          this.replaceTemplateWithEnv(config[key]);
          break;
        }
        default:
          continue;
      }
    }
  }
}

export default new Config();
