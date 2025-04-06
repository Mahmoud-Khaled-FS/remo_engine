import * as cp from 'child_process';
import { promisify } from 'util';
const exec = promisify(cp.exec);

import { Command } from '../../../src/engine/command';

class InfoCommand extends Command {
  async exec() {
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
}

export default InfoCommand;
