import type { Command } from '../../../engine/command';

type CommandArgs = {
  playlist: string;
  url: string;
};

class AddPlaylistCommand implements Command<CommandArgs> {
  exec(args: CommandArgs): string {
    console.log(`(${args.playlist})[${args.url}]`);
    return 'music';
  }

  help(): string {
    return 'add playlist to DB';
  }
  validateArgs(args: string[]): CommandArgs {
    return {
      playlist: args[0],
      url: args[1],
    };
  }
}

export default AddPlaylistCommand;
