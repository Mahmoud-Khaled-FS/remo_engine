import type { Command } from './command';

type CommandConstructor<T extends Record<string, string> = {}> = { new (...args: any): Command<T> };

export abstract class Plugin {
  protected commands = new Map<string, CommandConstructor>();
  abstract init(): PluginInitializer;

  protected addCommand(name: string, command: CommandConstructor) {
    this.commands.set(name, command);
  }

  public getCommand(name: string): CommandConstructor | null {
    if (!this.commands.has(name)) {
      return null;
    }
    return this.commands.get(name)!;
  }
}

export interface PluginInitializer {
  name: string;
}
