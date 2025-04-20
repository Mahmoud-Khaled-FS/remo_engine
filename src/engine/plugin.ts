import HelpCommand from '../commands/help';
import type { Command } from './command';

type CommandConstructor = { new (...args: any): Command<any> };

export abstract class Plugin {
  abstract name: string;
  defaultCommand?: string;
  abstract init(): void;

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

  public getCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  public shouldLoad(): boolean | Promise<boolean> {
    return true;
  }
}

export class CorePlugin extends Plugin {
  public name = 'core';
  public init(): void {
    this.addCommand('help', HelpCommand);
  }
}
