import Engine from './engine';
import MusicPlugin from './plugins/music';

function main(): number {
  const engine = new Engine();
  engine.subscribe(new MusicPlugin());
  engine.run(`remo music add playlist
    name=sad
    url=https://google.com
    `);
  return 0;
}

process.exit(main());
