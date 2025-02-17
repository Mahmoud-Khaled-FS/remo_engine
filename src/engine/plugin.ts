export interface Plugin {
  init(): PluginInitializer;
}

export interface PluginInitializer {
  name: string;
}
