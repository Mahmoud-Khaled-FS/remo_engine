export interface EngineContext {
  text(text: string): Promise<void>;
  file(path: string, type?: string): Promise<void>;
}
