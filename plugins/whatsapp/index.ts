import { z } from 'zod';
import { Command, type Args } from '../../src/engine/command';
import { Plugin, type PluginInitializer } from '../../src/engine/plugin';

class PcPlugin extends Plugin {
  protected defaultCommand?: string | undefined = 'direct';

  init(): PluginInitializer {
    this.addCommand('direct', DirectMessage);
    return {
      name: 'whatsapp',
    };
  }
}

export default PcPlugin;

class DirectMessage extends Command<{ number: string; message?: string }> {
  args: Args = [
    { name: 'number', description: 'Phone number', validation: z.string() },
    { name: 'message', description: 'Message', validation: z.string().optional() },
  ];

  exec(args: { number: string; message?: string }) {
    // NOTE (MAHMOUD) - Only available for Egyptian numbers
    const params = new URLSearchParams();
    params.set('text', args.message ?? '');
    return `https://wa.me/+2${args.number}?` + params.toString();
  }
}
