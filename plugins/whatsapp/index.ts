import { z } from 'zod';
import { Command, type Args } from '@src/engine/command';
import { Plugin } from '@src/engine/plugin';
import type { EngineContext } from '@src/engine/Context';

class PcPlugin extends Plugin {
  name: string = 'whatsapp';
  defaultCommand?: string | undefined = 'direct';

  init(): void {
    this.addCommand('direct', DirectMessage);
  }
}

export default PcPlugin;

class DirectMessage extends Command<{ number: string; message?: string }> {
  args: Args = [
    { name: 'number', description: 'Phone number', validation: z.string() },
    { name: 'message', description: 'Message', validation: z.string().optional() },
  ];

  exec(ctx: EngineContext, args: { number: string; message?: string }) {
    // NOTE (MAHMOUD) - Only available for Egyptian numbers
    const params = new URLSearchParams();
    params.set('text', args.message ?? '');
    ctx.text(`https://wa.me/+2${args.number}?` + params.toString());
  }
}
