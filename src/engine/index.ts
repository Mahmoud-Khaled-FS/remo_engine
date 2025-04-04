import { BOT_NAME } from '../constant';
import { error } from '../utils/logger';
import { trimList } from '../utils/strings';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { EngineArgument, Command, CommandData } from './command';
import Parser, { TokenType } from './parser';
import type { Plugin } from './plugin';

class Engine {
  private readonly plugins: Map<string, Plugin> = new Map();

  public async registerPlugin(name: string) {
    const plugin = await this.importDynamicPlugin(name);
    if (!plugin) {
      throw new Error(`Can not import dynamic plugin ${plugin}`);
    }
    const initData = await plugin.init();
    if (this.plugins.has(initData.name)) {
      // TODO (MAHMOUD) - Create App Error!
      throw new Error(`There is another plugin under name ${initData.name}`);
    }
    this.plugins.set(initData.name, plugin);
  }

  public async executeCommand(commandString: string) {
    const commandData = this.prepareCommand(commandString);
    const plugin = this.plugins.get(commandData.plugin);
    if (!plugin) {
      throw new Error(`Plugin "${commandData.plugin}" not found!`);
    }
    const CommandConstructor = plugin.getCommand(commandData.name);
    if (!CommandConstructor) {
      throw new Error(`Command "${commandData.name}" not found in plugin "${commandData.plugin}"`);
    }
    const command = new CommandConstructor();
    if (commandData.args[0].value === '.help') {
      return this.printUsage(commandData, command.help());
    }
    const args = command.validateArgs(commandData.args);
    return await command.exec(args);
  }

  private async importDynamicPlugin(name: string): Promise<Plugin | null> {
    try {
      const pluginPath = path.join(__dirname, '..', '..', 'plugins', name);
      if (!fs.existsSync(pluginPath)) {
        return null;
      }
      const dir = fs.statSync(pluginPath);
      if (!dir.isDirectory()) {
        return null;
      }
      const pluginFile = await import(path.join(pluginPath, 'index.ts'));
      if (!pluginFile) {
        return null;
      }
      return new pluginFile.default();
    } catch (error) {
      return null;
    }
  }

  private prepareCommand(command: string): CommandData {
    const parser = new Parser();
    const tokens = parser.parse(command);
    let index = 1;
    const pluginName = tokens[index++].value!;
    const commandName = tokens[index++].value ?? 'DEFAULT';
    const args: EngineArgument[] = [];
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

  private printUsage(commandData: CommandData, argsHelper: string[]): string {
    return `Usage: ${BOT_NAME} ${commandData.plugin} ${commandData.name}\n${argsHelper.join('\n')}`;
  }
}

export default Engine;
