import type { Engine } from './engine';

export interface AdapterIO {
  text(text: string): Promise<void>;
  file(path: string, type?: string): Promise<void>;
}

class Context {
  constructor(public readonly engine: Engine, public readonly io: AdapterIO) {}
}

export default Context;
