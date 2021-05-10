declare module '@capacitor/core' {
  interface PluginRegistry {
    TestPlugin: TestPluginPlugin;
  }
}

export interface TestPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
