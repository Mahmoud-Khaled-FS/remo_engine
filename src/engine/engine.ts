import { BOT_NAME } from '../constant';
import { info, warn } from '../utils/logger';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { EngineArgument, Command, CommandData } from './command';
import Parser, { TokenType } from './parser';
import { CorePlugin, Plugin } from './plugin';
import AppError from '../utils/error';
import Context, { type AdapterIO } from './Context';

export class Engine {
  public constructor() {
    this.registerPlugin(new CorePlugin());
  }
  private readonly plugins: Map<string, Plugin> = new Map();

  public async registerPlugin(name: string | Plugin) {
    let plugin: Plugin | null;
    if (name instanceof Plugin) {
      plugin = name;
    } else {
      plugin = await this.importDynamicPlugin(name);
    }
    if (!plugin) {
      warn(`Plugin ${name} can not be loaded.`);
      return;
    }
    const shouldLoad = await plugin.shouldLoad();
    if (!shouldLoad) {
      warn(`Plugin ${plugin.name} is not loaded!`);
      return;
    }
    await plugin.init();
    if (this.plugins.has(plugin.name)) {
      // TODO (MAHMOUD) - Create App Error!
      throw new AppError(`There is another plugin under name ${plugin.name}`, 'PLUGIN_CONFLICT', false);
    }
    this.plugins.set(plugin.name, plugin);
  }

  public async executeCommand(commandString: string, io: AdapterIO) {
    const commandData = this.prepareCommand(commandString);
    if (commandData.plugin === 'core') {
    }
    const plugin = this.plugins.get(commandData.plugin);
    if (!plugin) {
      throw new AppError(`Plugin "${commandData.plugin}" not found!`);
    }
    const CommandConstructor = plugin.getCommand(commandData.name);
    if (!CommandConstructor) {
      throw new AppError(`Command "${commandData.name}" not found in plugin "${commandData.plugin}"`);
    }
    const command = new CommandConstructor();
    if (commandData.args.length > 0 && commandData.args[0].value === '.help') {
      return this.printUsage(commandData, command.help());
    }
    const args = command.validateArgs(commandData.args);
    const context = new Context(this, io);
    return await command.exec(context, args);
  }

  public getPluginsNamesWithCommands(): { name: string; commands: string[] }[] {
    const plugins: { name: string; commands: string[] }[] = [];
    for (const plugin of this.plugins.values()) {
      const commands: string[] = plugin.getCommands();
      plugins.push({ name: plugin.name, commands: commands });
    }
    return plugins;
  }

  private async importDynamicPlugin(name: string): Promise<Plugin | null> {
    try {
      const pluginPath = path.resolve(name);
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
      const plugin = new pluginFile.default();
      if (!(plugin instanceof Plugin)) return null;
      info(`[${plugin.name}] plugin init!`);
      return plugin;
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
