import { existsSync } from 'node:fs';
import { z } from 'zod';
import { Command, type Args } from '@src/engine/command';
import type { EngineContext } from '@src/engine/Context';
import { Plugin } from '@src/engine/plugin';
import { resolve } from 'node:path';
import config from '@src/config';

// TODO (MAHMOUD) - move to database
class QueuePlugin extends Plugin {
  public name = 'queue';
  defaultCommand?: string | undefined = 'first';
  init(): void {
    this.addCommand('first', FirstQueueCommand);
    this.addCommand('push', PushQueueCommand);
    this.addCommand('shift', ShiftQueueCommand);
    this.addCommand('length', lengthQueueCommand);
  }
}

export default QueuePlugin;

class FirstQueueCommand extends Command<{ name: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];

  async exec(ctx: EngineContext, args: { name: string }) {
    const path = resolve(config.getPluginConfig<{ savePath: string }>('queue').savePath, `${args.name}.json`);
    if (!existsSync(path)) {
      await ctx.text('Queue is empty');
      return;
    }
    const queue = await import(path);
    await ctx.text(queue.default[0]);
  }
}

class PushQueueCommand extends Command<{ name: string; value: string }> {
  args = [
    { name: 'value', validation: z.string() },
    { name: 'name', validation: z.string().default('default') },
  ];
  async exec(ctx: EngineContext, args: { name: string; value: string }) {
    const path = resolve(config.getPluginConfig<{ savePath: string }>('queue').savePath, `${args.name}.json`);
    const file = Bun.file(path);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(path);
      queue.default.push(args.value);
      await Bun.write(path, JSON.stringify(queue.default));
      return;
    } else {
      await Bun.write(path, JSON.stringify([args.value]));
    }
    await ctx.text('Added to queue');
  }
}

class ShiftQueueCommand extends Command<{ name: string; value: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];
  async exec(ctx: EngineContext, args: { name: string; value: string }) {
    const path = resolve(config.getPluginConfig<{ savePath: string }>('queue').savePath, `${args.name}.json`);
    const file = Bun.file(path);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(path);
      queue.default.shift();
      await Bun.write(path, JSON.stringify(queue.default));
      return;
    }
    await ctx.text('Queue is empty');
  }
}

class lengthQueueCommand extends Command<{ name: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];
  async exec(ctx: EngineContext, args: { name: string }) {
    const path = resolve(config.getPluginConfig<{ savePath: string }>('queue').savePath, `${args.name}.json`);
    const file = Bun.file(path);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(path);
      await ctx.text(queue.default.length.toString());
      return;
    }
    await ctx.text('Queue is empty');
  }
}
