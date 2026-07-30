import 'dotenv/config';
import pg from 'pg';
import { utworzAplikacje } from './aplikacja.mjs';
import { wczytajKonfiguracje } from './konfiguracja.mjs';

const konfiguracja = wczytajKonfiguracje();
const pula = new pg.Pool({ connectionString: konfiguracja.adresBazy });
const aplikacja = utworzAplikacje({ pula, konfiguracja });
const serwer = aplikacja.listen(konfiguracja.port, () => {
  console.log(`Backend działa na porcie ${konfiguracja.port}.`);
});

let zamykanie = false;

async function zamknijAplikacje(sygnal) {
  if (zamykanie) return;
  zamykanie = true;
  console.log(`Odebrano ${sygnal}. Zamykanie serwera.`);

  const awaryjneZakonczenie = setTimeout(() => {
    console.error('Nie udało się zamknąć serwera w wyznaczonym czasie.');
    process.exit(1);
  }, 10_000);
  awaryjneZakonczenie.unref();

  try {
    await new Promise((rozwiaz, odrzuc) => serwer.close(blad => blad ? odrzuc(blad) : rozwiaz()));
    await pula.end();
    clearTimeout(awaryjneZakonczenie);
    process.exit(0);
  } catch (blad) {
    console.error('Błąd podczas zamykania serwera:', blad instanceof Error ? blad.message : 'nieznany błąd');
    process.exit(1);
  }
}

process.once('SIGINT', () => void zamknijAplikacje('SIGINT'));
process.once('SIGTERM', () => void zamknijAplikacje('SIGTERM'));

serwer.on('error', blad => {
  console.error('Nie udało się uruchomić serwera:', blad instanceof Error ? blad.message : 'nieznany błąd');
  void pula.end().finally(() => process.exit(1));
});
