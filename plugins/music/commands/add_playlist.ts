import type { Command, EngineArgument } from '../../../src/engine/command';

type CommandArgs = {};

class SuggestMusicCommand implements Command<CommandArgs> {
  exec(args: unknown): string {
    return 'music';
  }

  help(): string {
    return 'suggest music help to get music!';
  }
  validateArgs(args: EngineArgument[]): CommandArgs | Promise<CommandArgs> {
    return {};
  }
}

export default SuggestMusicCommand;
