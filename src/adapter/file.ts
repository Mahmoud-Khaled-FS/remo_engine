import * as fs from 'node:fs';
import AppError from '../utils/error';
import { exit } from '../utils/exit';
import { Adapter } from './adapter';

class FileAdapter extends Adapter {
  async run(): Promise<void> {
    try {
      if (process.argv.length < 3) {
        exit('There is no remo file to execute!');
      }
      if (!fs.existsSync(this.argv[0])) {
        exit(`file not found! path:"${this.argv[0]}"`);
      }
      if (!fs.statSync(this.argv[0]).isFile()) {
        exit(`invalid file! path:"${this.argv[0]}"`);
      }
      const commandFile = await Bun.file(this.argv[0]).text();

      const output = await this.engine.executeCommand(commandFile);
      console.log(output);
    } catch (err) {
      if (err instanceof AppError) {
        if (err.shouldLog || this.argv.includes('--debug')) {
          exit(err.message);
        }
        exit('Something went wrong!');
      }
      if (this.argv.includes('--debug')) {
        exit((err as Error).message);
      }
      exit('Something went wrong!');
    }
  }
}

export default FileAdapter;
