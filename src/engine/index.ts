import { BOT_NAME } from '../constant';
import { error } from '../utils/logger';
import { trimList } from '../utils/strings';
import type { Argument, Command, CommandData } from './command';
import Parser, { TokenType } from './parser';
import type { Plugin } from './plugin';

class Engine {
  private readonly plugins: Map<string, Plugin> = new Map();

  public subscribe(plugin: Plugin) {
    const initData = plugin.init();
    if (this.plugins.has(initData.name)) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error(`There is another plugin under name ${initData.name}`);
    }
    this.plugins.set(initData.name, plugin);
  }

  public run(commandString: string) {
    const commandData = this.prepareCommand(commandString);
    // const command = this.getCommand(parsed);
    console.log(commandData);
    // const args = command.validateArgs(parsed.args);
    // command.exec(args);
  }

  private prepareCommand(command: string): CommandData {
    const parser = new Parser();
    const tokens = parser.parse(command);
    let index = 1;
    const pluginName = tokens[index++].value!;
    const commandName = tokens[index++].value ?? 'DEFAULT';
    const args: Argument[] = [];
    while (index < tokens.length) {
      if (tokens[index].type === TokenType.EOF || tokens[index].type == TokenType.NEW_LINE) {
        index++;
        break;
      }
      if (tokens[index].type === TokenType.ARG_NAME) {
        args.push({
          name: tokens[index++].value!,
          value: tokens[index++].value!,
        });
      } else {
        args.push({
          value: tokens[index++].value!,
        });
      }
    }
    const parsedCommand: CommandData = {
      plugin: pluginName,
      name: commandName,
      args: args,
    };
    return parsedCommand;
  }

  private getCommand(parsedCommand: CommandData): Command {
    const plugin = this.plugins.get(parsedCommand.plugin)!;
    const command = plugin.getCommand(parsedCommand.name);
    if (!command) {
      throw new Error(`Invalid Command ${parsedCommand.name}!`);
    }
    return command;
  }
}

export default Engine;
