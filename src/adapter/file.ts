import * as fs from 'node:fs';
import AppError from '../utils/error';
import { exit } from '../utils/exit';
import { Adapter } from './adapter';
import type { AdapterIO } from '../engine/Context';

class FileIO implements AdapterIO {
  async file(path: string, type?: string): Promise<void> {
    console.log(`file: ${path}`);
  }

  async text(text: string): Promise<void> {
    console.log(text);
  }
}

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
      const fileIO = new FileIO();
      await this.engine.executeCommand(commandFile, fileIO);
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
