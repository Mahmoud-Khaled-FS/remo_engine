import Engine from './engine';
import MusicPlugin from './plugins/music';

function main(): number {
  const engine = new Engine();
  engine.subscribe(new MusicPlugin());
  console.log(
    engine.parseCommand(`remo music add playlist
    name=sad
    url=https://google.com
    `),
  );
  return 0;
}

process.exit(main());
