import { Bot } from 'grammy';
import { exit } from '../utils/exit';
import { Adapter } from './adapter';
import { error } from '../utils/logger';

class TelegramAdapter extends Adapter {
  run(): void | Promise<void> {
    if (this.argv.length < 1) {
      exit('There is no token!');
    }
    const bot = new Bot(this.argv[0]);
    bot.on('message:text', async (ctx) => {
      let message = ctx.message.text.toLowerCase().trim();
      if (!message || message.length < 1) return;
      if (message[0] === 'R') message = 'r' + message.slice(1);
      if (!message.startsWith('remo')) return;
      try {
        const result = await this.engine.executeCommand(message);
        if (result) {
          ctx.reply(result, {
            reply_parameters: {
              message_id: ctx.message.message_id,
            },
          });
        } else {
          ctx.reply('Done!');
        }
      } catch (err) {
        error((err as Error).message!);
      }
    });
    bot.start();
  }
}

export default TelegramAdapter;
