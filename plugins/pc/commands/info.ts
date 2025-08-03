import os from "node:os";

import { Command } from '@src/engine/command';
import type Context from '@src/engine/Context';
import { exec } from '@src/utils/childProcess';

class InfoCommand extends Command {
  async exec(ctx: Context) {
    let result = 'Unsported os!';
    switch (os.platform()){
      case 'win32': 
        result = await this.windowsInfo();
        break;
      case 'linux':
        result = await this.linuxInfo();
        break;
    }
    ctx.io.text(result);
  }

  private async windowsInfo() {
    const { stdout } = await exec('systeminfo');
    const lines = stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    const info: any = lines
      .map((line) => line.split(': '))
      .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value?.trim() }), {});

    const result = [
      `OS: ${info['OS Name']} ${info['OS Version']}`,
      `System Type: ${info['System Type']}`,
      'Time Zone: ' + info['Time Zone'],
      `RAM: ${info['Available Physical Memory']}/${info['Total Physical Memory']}`,
    ];
    return result.join('\n');
  }

  private async linuxInfo() {
  const { stdout } = await exec('uname -a');
  return `OS Info: ${stdout.trim()}`;
  }
}

export default InfoCommand;
