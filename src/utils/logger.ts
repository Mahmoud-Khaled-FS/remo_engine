export function info(message: any) {
  printLog('INFO', message);
}

export function warn(message: any) {
  printLog('WARN', message);
}
export function error(message: any) {
  printLog('ERROR', message);
}

function printLog(level: string, message: any) {
  const time = new Date();
  const h = (time.getHours() % 12).toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');
  const timeFormat = `${h}:${m}:${s}`;
  console.log(`[${level} - ${timeFormat}] ${message}`);
}
