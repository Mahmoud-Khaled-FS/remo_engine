import type Engine from '../engine';

export abstract class Adapter {
  constructor(protected readonly engine: Engine, protected readonly argv: string[]) {}

  abstract run(): void | Promise<void>;
}
