import { WebPlugin } from '@capacitor/core';
import { TestPluginPlugin } from './definitions';

export class TestPluginWeb extends WebPlugin implements TestPluginPlugin {
  constructor() {
    super({
      name: 'TestPlugin',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

const TestPlugin = new TestPluginWeb();

export { TestPlugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(TestPlugin);
