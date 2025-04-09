import { Command } from '../../../src/engine/command';
import type { EngineContext } from '../../../src/engine/Context';
import { exec } from '../../../src/utils/childProcess';

class InfoCommand extends Command {
  async exec(ctx: EngineContext) {
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
    ctx.text(result.join('\n'));
  }
}

export default InfoCommand;
