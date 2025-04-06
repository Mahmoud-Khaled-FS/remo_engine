import * as cp from 'child_process';
import { promisify } from 'util';
const exec = promisify(cp.exec);

import { Command } from '../../../src/engine/command';

class ShutdownCommand extends Command {
  async exec() {
    exec(`powershell shutdown /s`);
    return 'Goodbye!';
  }
}

export default ShutdownCommand;
