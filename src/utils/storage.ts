import { resolve } from 'node:path';

export function getStoragePath(path: string) {
  return resolve(process.cwd(), 'data', 'storage', path);
}

export function getTempPath(path: string) {
  return resolve(process.cwd(), 'data', 'temp', path);
}
