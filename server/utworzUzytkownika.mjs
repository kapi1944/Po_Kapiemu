import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import pg from 'pg';
import { wczytajKonfiguracje } from './konfiguracja.mjs';

const dozwoloneRole = new Set(['wlasciciel', 'administrator', 'moderator', 'redaktor', 'wspierajacy', 'uzytkownik', 'widz']);

function pobierzUkryteHaslo(etykieta) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Tworzenie użytkownika wymaga interaktywnego terminala TTY.');
  }

  return new Promise((rozwiaz, odrzuc) => {
    let wartosc = '';
    process.stdout.write(etykieta);
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const zakoncz = () => {
      process.stdin.off('data', obsluzZnak);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
    };

    const obsluzZnak = znak => {
      if (znak === '\u0003') {
        zakoncz();
        odrzuc(new Error('Przerwano wprowadzanie hasła.'));
        return;
      }
      if (znak === '\r' || znak === '\n') {
        zakoncz();
        rozwiaz(wartosc);
        return;
      }
      if (znak === '\u0008' || znak === '\u007f') {
        wartosc = Array.from(wartosc).slice(0, -1).join('');
        return;
      }
      if (!/[\u0000-\u001f\u007f]/.test(znak)) wartosc += znak;
    };

    process.stdin.on('data', obsluzZnak);
  });
}

async function uruchom() {
  const [emailArgument, nazwaArgument, roleArgument = 'uzytkownik', ...nadmiaroweArgumenty] = process.argv.slice(2);
  if (nadmiaroweArgumenty.length) {
    throw new Error('Hasła nie wolno przekazywać jako argumentu. Użycie: npm run uzytkownik:utworz -- e-mail "Nazwa" rola[,rola]');
  }

  const email = emailArgument?.trim().toLowerCase();
  const nazwaWyswietlana = nazwaArgument?.trim();
  const role = roleArgument.split(',').map(rola => rola.trim()).filter(Boolean);
  if (!email || email.length > 254 || !nazwaWyswietlana || nazwaWyswietlana.length > 120 || !role.length || role.some(rola => !dozwoloneRole.has(rola))) {
    throw new Error('Użycie: npm run uzytkownik:utworz -- e-mail "Nazwa" rola[,rola]');
  }

  const haslo = await pobierzUkryteHaslo('Hasło: ');
  const powtorzoneHaslo = await pobierzUkryteHaslo('Powtórz hasło: ');
  if (haslo !== powtorzoneHaslo) throw new Error('Podane hasła nie są identyczne.');
  if (Array.from(haslo).length < 12) throw new Error('Hasło musi mieć co najmniej 12 znaków.');
  if (Buffer.byteLength(haslo, 'utf8') > 72) throw new Error('Hasło może mieć maksymalnie 72 bajty UTF-8.');

  const konfiguracja = wczytajKonfiguracje();
  const pula = new pg.Pool({ connectionString: konfiguracja.adresBazy });
  try {
    const hashHasla = await bcrypt.hash(haslo, konfiguracja.kosztBcrypt);
    await pula.query(
      'INSERT INTO uzytkownicy (id, email, nazwa_wyswietlana, role, hash_hasla) VALUES ($1, $2, $3, $4, $5)',
      [crypto.randomUUID(), email, nazwaWyswietlana, role, hashHasla],
    );
    console.log(`Utworzono konto ${email}.`);
  } finally {
    await pula.end();
  }
}

uruchom().catch(blad => {
  console.error(blad instanceof Error ? blad.message : 'Nie udało się utworzyć użytkownika.');
  process.exitCode = 1;
});
