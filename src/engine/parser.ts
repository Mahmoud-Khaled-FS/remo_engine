import { BOT_NAME } from '../constant';
import AppError from '../utils/error';
import { trimList } from '../utils/strings';

class Parser {
  tokens: Token[] = [];
  public parse(commandString: string): Token[] {
    const lines = trimList(commandString.split('\n'));
    if (lines.length === 0) {
      throw new AppError('Syntax Error! Command is empty.', 'SYNTAX_ERROR');
    }
    let index = 0;
    this.parseCommandMetadata(lines[index++]);
    const args: string[] = [];

    for (; index < lines.length; index++) {
      if (lines[index] === '') {
        break;
      }
      args.push(lines[index]);
    }
    this.parseCommandPayload(args);
    if (index === lines.length - 1) {
      this.tokens.push({ type: TokenType.EOF });
      index++;
    } else {
      this.tokens.push({ type: TokenType.NEW_LINE });
    }
    return this.tokens;
  }

  private parseCommandMetadata(line: string) {
    const words = line.split(/\s+/);
    if (words.length < 2) {
      throw new AppError('Syntax Error! Missing required arguments.');
    }
    if (words[0] !== BOT_NAME) {
      throw new AppError('Syntax Error! Invalid bot name.');
    }
    this.tokens.push({ type: TokenType.BOT_NAME });
    this.tokens.push({ type: TokenType.PLUG_NAME, value: words[1] });
    const commandName = words.slice(2).join(' ');
    this.tokens.push({ type: TokenType.COMMAND_NAME, value: commandName ?? null });
  }

  private parseCommandPayload(lines: string[]) {
    let isStartNamed = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('.') && line.includes('=')) {
        isStartNamed = true;
        const words = line.split('=');
        this.tokens.push({ type: TokenType.ARG_NAME, value: words[0].slice(1) });
        this.tokens.push({ type: TokenType.ARG_VALUE, value: words.slice(1).join('=') });
        continue;
      }
      if (isStartNamed) {
        throw new AppError(`Syntax Error!  Unnamed argument found after named arguments: "${line}"`);
      }
      this.tokens.push({ type: TokenType.ARG_VALUE, value: line });
    }
  }
}

type Token = {
  type: TokenType;
  value?: string | null;
};

export enum TokenType {
  BOT_NAME,
  PLUG_NAME,
  COMMAND_NAME,

  ARG_VALUE,
  ARG_NAME,

  LIST_START,
  LIST_ITEM,
  LIST_END,

  OPERATOR_ADD,
  IDENTIFIER,

  NEW_LINE,
  EOF,
}

export default Parser;
