import { error } from './logger';

export function exit(message: string, code: number = 1): never {
  error(message);
  process.exit(code);
}
