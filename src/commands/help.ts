import { Command } from '../engine/command';
import type { EngineContext } from '../engine/Context';

class HelpCommand extends Command {
  async exec(ctx: EngineContext, args: null) {
    const plugins = ctx.engine.getPluginsNamesWithCommands();
    const commands: string[] = [];
    for (const plugin of plugins) {
      commands.push(`[${plugin.name}]`);
      plugin.commands.forEach((c) => commands.push(`\t${c}`));
    }
    await ctx.text(commands.join('\n'));
  }
}

export default HelpCommand;
