import type { Command } from './command';

export abstract class Plugin {
  protected commands = new Map<string, Command>();
  abstract init(): PluginInitializer;

  protected addCommand(name: string, command: Command) {
    this.commands.set(name, command);
  }

  public getCommand(name: string): Command | null {
    if (!this.commands.has(name)) {
      return null;
    }
    return this.commands.get(name)!;
  }
}

export interface PluginInitializer {
  name: string;
}
