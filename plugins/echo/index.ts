import { Plugin } from '../../src/engine/plugin';
import { Command, type Args, type EngineArgument } from '../../src/engine/command';
import { z } from 'zod';
import type { EngineContext } from '../../src/engine/Context';

class EchoPlugin extends Plugin {
  defaultCommand: string = 'print';
  name: string = 'echo';
  init(): void {
    this.addCommand('print', PrintCommand);
  }
}

export default EchoPlugin;

class PrintCommand extends Command<{
  text: string;
}> {
  args: Args = [
    {
      name: 'text',
      validation: z.string(),
      description: 'The message to print',
    },
  ];

  async exec(ctx: EngineContext, args: { text: string }) {
    await ctx.text(args.text);
  }
}
