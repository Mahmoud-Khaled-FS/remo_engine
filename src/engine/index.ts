import { BOT_NAME } from '../constant';
import { error } from '../utils/logger';
import { trimLines } from '../utils/strings';
import type { ParsedCommand } from './command';
import type { Plugin } from './plugin';

class Engine {
  private readonly plugins: Map<string, Plugin> = new Map();
  public parseCommand(command: string): ParsedCommand {
    if (!command.startsWith(BOT_NAME)) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error('Invalid command!');
    }
    const lines = trimLines(command.split('\n'));
    const commandData = lines[0].split(' ');
    if (commandData.length < 3) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error("Can't parse this command!");
    }
    if (!this.plugins.has(commandData[1])) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error('Invalid Plugin name');
    }
    const parsedCommand: ParsedCommand = {
      plugin: commandData[1],
      name: commandData.slice(2).join(' '),
      args: lines.slice(1),
    };
    return parsedCommand;
  }

  public subscribe(plugin: Plugin) {
    const initData = plugin.init();
    if (this.plugins.has(initData.name)) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error(`There is another plugin under name ${initData.name}`);
    }
    this.plugins.set(initData.name, plugin);
  }
}

export default Engine;
