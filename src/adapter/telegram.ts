import { Bot, Context, InputFile } from 'grammy';
import { exit } from '../utils/exit';
import { Adapter } from './adapter';
import { error } from '../utils/logger';
import type { AdapterIO } from '../engine/Context';
import config from '../config';

class TelegramIO implements AdapterIO {
  constructor(private readonly ctx: Context) {}
  async text(text: string): Promise<void> {
    await this.ctx.reply(text);
  }

  async file(path: string, type?: string): Promise<void> {
    const inputFile = new InputFile(path);
    switch (type) {
      case 'image': {
        await this.ctx.replyWithPhoto(inputFile);
        break;
      }
      case 'video': {
        await this.ctx.replyWithVideo(inputFile);
        break;
      }
      default: {
        await this.ctx.replyWithDocument(inputFile);
      }
    }
  }
}

class TelegramAdapter extends Adapter {
  run(): void | Promise<void> {
    const telegramConfig = config.getAdapterConfig<{ botToken: string; ownerId: number }>('telegram');
    const bot = new Bot(telegramConfig.botToken);
    bot.on('message:text', async (ctx) => {
      let message = ctx.message.text.trim();
      if (!message || message.length < 1) return;
      if (message[0] === 'R') message = 'r' + message.slice(1);
      if (!message.startsWith('remo')) return;
      // TODO (MAHMOUD) - add authorization!
      if (ctx.from.id !== telegramConfig.ownerId) {
        ctx.reply('Sorry, Only my owner can use me for now! 😔');
        return;
      }
      try {
        if (ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
          const messageLines = message.split('\n');
          if (messageLines.at(-1) === '#no_args') {
            message = messageLines.slice(0, messageLines.length - 1).join('\n');
          } else {
            message = [messageLines[0], ctx.message.reply_to_message.text, ...messageLines.slice(1)].join('\n');
          }
        }
        const telegramIO = new TelegramIO(ctx);
        await this.engine.executeCommand(message, telegramIO);
      } catch (err) {
        error((err as Error).message!);
      }
    });
    bot.start();
  }
}

export default TelegramAdapter;
