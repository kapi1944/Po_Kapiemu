import fs from 'node:fs';
import path from 'node:path';

const katalogGlowny = path.resolve(import.meta.dirname, '..');
const pomijaneKatalogi = new Set(['.git', 'dist', 'node_modules']);
const pomijanePliki = new Set(['package-lock.json']);
const rozszerzeniaTekstowe = new Set([
  '.css', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.sql', '.svg', '.ts', '.tsx', '.txt', '.yml', '.yaml',
]);
const podejrzaneFragmenty = [
  [0x00c3],
  [0x00c2],
  [0x0102],
  [0x0139],
  [0x00c5],
  [0xfffd],
  [0x00e2, 0x20ac],
  [0x00e2, 0x2020],
  [0x00e2, 0x20ac, 0x201c],
  [0x00e2, 0x20ac, 0x201d],
  [0x00e2, 0x20ac, 0x201e],
  [0x00e2, 0x20ac, 0x00a6],
  [0x00e2, 0x2013],
].map(kody => String.fromCodePoint(...kody));

function pobierzPliki(katalog) {
  return fs.readdirSync(katalog, { withFileTypes:true }).flatMap(wpis => {
    if (wpis.isDirectory() && pomijaneKatalogi.has(wpis.name)) return [];
    const sciezka = path.join(katalog, wpis.name);
    if (wpis.isDirectory()) return pobierzPliki(sciezka);
    if (pomijanePliki.has(wpis.name) || !rozszerzeniaTekstowe.has(path.extname(wpis.name).toLowerCase())) return [];
    return [sciezka];
  });
}

const problemy = [];
for (const plik of pobierzPliki(katalogGlowny)) {
  const tresc = fs.readFileSync(plik, 'utf8');
  if (tresc.includes('\0')) continue;
  tresc.split(/\r?\n/).forEach((linia, indeks) => {
    if (podejrzaneFragmenty.some(fragment => linia.includes(fragment))) {
      problemy.push(`${path.relative(katalogGlowny, plik)}:${indeks + 1}`);
    }
  });
}

if (problemy.length) {
  console.error('Wykryto możliwe uszkodzenie kodowania UTF-8:');
  problemy.forEach(problem => console.error(`- ${problem}`));
  process.exitCode = 1;
} else {
  console.log('Kodowanie UTF-8: bez podejrzanych sekwencji.');
}
