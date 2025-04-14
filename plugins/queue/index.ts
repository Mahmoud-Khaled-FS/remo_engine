import { existsSync } from 'node:fs';
import { z } from 'zod';
import { Command, type Args } from '../../src/engine/command';
import type { EngineContext } from '../../src/engine/Context';
import { Plugin } from '../../src/engine/plugin';

// TODO (MAHMOUD) - move to database
class QueuePlugin extends Plugin {
  public name = 'queue';
  defaultCommand?: string | undefined = 'first';
  init(): void {
    this.addCommand('first', FirstQueueCommand);
    this.addCommand('add', AddQueueCommand);
    this.addCommand('remove', RemoveQueueCommand);
    this.addCommand('length', lengthQueueCommand);
  }
}

export default QueuePlugin;

class FirstQueueCommand extends Command<{ name: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];
  async exec(ctx: EngineContext, args: { name: string }) {
    if (!existsSync(`${process.cwd()}/queue/${args.name}.json`)) {
      await ctx.text('Queue is empty');
      return;
    }
    const queue = await import(`../../queue/${args.name}.json`);
    await ctx.text(queue.default[0]);
  }
}

class AddQueueCommand extends Command<{ name: string; value: string }> {
  args = [
    { name: 'value', validation: z.string() },
    { name: 'name', validation: z.string().default('default') },
  ];
  async exec(ctx: EngineContext, args: { name: string; value: string }) {
    const file = Bun.file(`${process.cwd()}/queue/${args.name}.json`);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(`../../queue/${args.name}.json`);
      queue.default.push(args.value);
      await Bun.write(`${process.cwd()}/queue/${args.name}.json`, JSON.stringify(queue.default));
      return;
    } else {
      await Bun.write(`${process.cwd()}/queue/${args.name}.json`, JSON.stringify([args.value]));
    }
    await ctx.text('Added to queue');
  }
}

class RemoveQueueCommand extends Command<{ name: string; value: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];
  async exec(ctx: EngineContext, args: { name: string; value: string }) {
    const file = Bun.file(`${process.cwd()}/queue/${args.name}.json`);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(`../../queue/${args.name}.json`);
      queue.default.shift();
      await Bun.write(`${process.cwd()}/queue/${args.name}.json`, JSON.stringify(queue.default));
      return;
    }
    await ctx.text('Queue is empty');
  }
}

class lengthQueueCommand extends Command<{ name: string }> {
  args = [{ name: 'name', validation: z.string().default('default') }];
  async exec(ctx: EngineContext, args: { name: string }) {
    const file = Bun.file(`${process.cwd()}/queue/${args.name}.json`);
    const isExists = await file.exists();
    if (isExists) {
      const queue = await import(`../../queue/${args.name}.json`);
      await ctx.text(queue.default.length.toString());
      return;
    }
    await ctx.text('Queue is empty');
  }
}
