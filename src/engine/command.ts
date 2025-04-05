import { z } from 'zod';
import AppError from '../utils/error';

export interface CommandData {
  plugin: string;
  name: string;
  args: EngineArgument[];
}

export interface EngineArgument {
  name?: string;
  value: string;
}

// export interface Command<T extends Record<string, string> = {}> {
//   help(): string;
//   exec(args: T): string | void | Promise<string> | Promise<void>;
//   validateArgs(args: EngineArgument[]): T | Promise<T>;
// }

export type Arg = {
  name: string;
  description?: string;
  validation?: z.ZodSchema;
};

export type Args = Arg[];

export abstract class Command<T extends Record<string, string> = {}> {
  abstract args: Args;

  abstract exec(args: T): string | void | Promise<string> | Promise<void>;

  public validateArgs(args: EngineArgument[]): T {
    const zodSchema: any = {};
    for (const index in this.args) {
      zodSchema[this.args[index].name] = this.args[index].validation ?? z.string().optional();
    }
    const data: any = {};
    for (const index in args) {
      if (args[index].name) {
        if (data[args[index].name]) {
          throw new AppError('Invalid args arrange can not have same arg name');
        }
        data[args[index].name] = args[index].value;
      } else {
        if (+index >= this.args.length) {
          throw new AppError('Invalid args arrange');
        }
        data[this.args[index].name] = args[index].value;
      }
    }
    const validatedArgs = z.object(zodSchema).safeParse(data);
    if (!validatedArgs.success) {
      throw new AppError(validatedArgs.error.message);
    }
    return validatedArgs.data as T;
  }

  help(): string[] {
    let helpMessages: string[] = [];
    for (const arg of this.args) {
      helpMessages.push(`${arg.name}= ${arg.description ?? ''}`);
    }
    return helpMessages;
  }
}
