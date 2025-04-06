import type { Command } from './command';

type CommandConstructor = { new (...args: any): Command<any> };

export abstract class Plugin {
  protected abstract defaultCommand?: string;
  abstract init(): PluginInitializer;

  protected commands = new Map<string, CommandConstructor>();

  protected addCommand(name: string, command: CommandConstructor) {
    this.commands.set(name, command);
  }

  public getCommand(name: string): CommandConstructor | null {
    if (name === '') {
      name = this.defaultCommand ?? '';
    }
    if (!this.commands.has(name)) {
      return null;
    }
    return this.commands.get(name)!;
  }
}

export interface PluginInitializer {
  name: string;
  defaultCommand?: string;
}
