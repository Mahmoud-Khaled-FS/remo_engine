import { Bot, Context, InputFile } from 'grammy';
import { exit } from '../utils/exit';
import { Adapter } from './adapter';
import { error } from '../utils/logger';
import type { EngineContext } from '../engine/Context';
import Config from '../config';
import type Engine from '../engine';

class TelegramContext implements EngineContext {
  constructor(private readonly ctx: Context, public readonly engine: Engine) {}
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
    if (this.argv.length < 1) {
      exit('There is no token!');
    }
    const bot = new Bot(Config.TELEGRAM_BOT_TOKEN);
    bot.on('message:text', async (ctx) => {
      let message = ctx.message.text.trim();
      if (!message || message.length < 1) return;
      if (message[0] === 'R') message = 'r' + message.slice(1);
      if (!message.startsWith('remo')) return;
      // TODO (MAHMOUD) - add authorization!
      if (ctx.from.id !== Config.TELEGRAM_OWNER_ID) {
        ctx.reply('Sorry, Only my owner can use me for now! 😔');
        return;
      }
      try {
        if (ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
          const messageLines = message.split('\n');
          message = [messageLines[0], ctx.message.reply_to_message.text, ...messageLines.slice(1)].join('\n');
        }
        const engineCtx = new TelegramContext(ctx, this.engine);
        await this.engine.executeCommand(message, engineCtx);
      } catch (err) {
        error((err as Error).message!);
      }
    });
    bot.start();
  }
}

export default TelegramAdapter;
