import { promisify } from 'util';
import { exec as nodeExec } from 'child_process';

export const exec = promisify(nodeExec);
