import type { Command } from '../../../engine/command';

type CommandArgs = {};

class SuggestMusicCommand implements Command<CommandArgs> {
  exec(args: unknown): string {
    return 'music';
  }

  help(): string {
    return 'suggest music help to get music!';
  }
  validateArgs(args: string[]): CommandArgs {
    return {};
  }
}

export default SuggestMusicCommand;
