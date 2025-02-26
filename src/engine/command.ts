export interface CommandData {
  plugin: string;
  name: string;
  args: EngineArgument[];
}

export interface EngineArgument {
  name?: string;
  value: string;
}

export interface Command<T extends Record<string, string> = {}> {
  help(): string;
  exec(args: T): string | void;
  validateArgs(args: EngineArgument[]): T;
}
