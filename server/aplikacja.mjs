import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const katalogSerwera = path.dirname(fileURLToPath(import.meta.url));
const katalogAplikacji = path.resolve(katalogSerwera, '..');
const nazwaCiasteczka = 'pk_sesja';
const hashHaslaZastepczego = '$2b$12$k3giltjeOd/dT.fe0D3D/uHAGbfMocxIwk.3R2KW6y2bif7t7GSt.';
const dozwoloneRole = new Set(['wlasciciel', 'administrator', 'moderator', 'redaktor', 'wspierajacy', 'uzytkownik', 'widz']);
const publicznyBladLogowania = { blad: 'Nieprawidłowy e-mail lub hasło.' };

function pobierzCiasteczka(naglowek = '') {
  return Object.fromEntries(naglowek.split(';').map(czesc => {
    const [klucz, ...wartosci] = czesc.trim().split('=');
    try {
      return [klucz, decodeURIComponent(wartosci.join('='))];
    } catch {
      return [klucz, ''];
    }
  }).filter(([klucz]) => klucz));
}

export function hashujToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function oczyscRole(role) {
  if (!Array.isArray(role)) return ['widz'];
  const poprawne = [...new Set(role.filter(rola => typeof rola === 'string' && dozwoloneRole.has(rola)))];
  return poprawne.length ? poprawne : ['widz'];
}

export function danePubliczneUzytkownika(wiersz) {
  return {
    id: wiersz.id,
    email: wiersz.email,
    nazwaWyswietlana: wiersz.nazwa_wyswietlana,
    role: oczyscRole(wiersz.role),
  };
}

function czyPoprawneDaneLogowania(email, haslo) {
  return email.length > 0
    && email.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    && haslo.length > 0
    && Buffer.byteLength(haslo, 'utf8') <= 72;
}

function czyZgodnePochodzenie(zadanie) {
  const pochodzenie = zadanie.get('origin');
  if (!pochodzenie) return false;
  try {
    return new URL(pochodzenie).host === zadanie.get('host');
  } catch {
    return false;
  }
}

export function utworzAplikacje({ pula, konfiguracja }) {
  if (!pula?.query) throw new Error('Fabryka aplikacji wymaga połączenia z bazą.');

  const aplikacja = express();
  aplikacja.set('trust proxy', konfiguracja.czyProdukcja ? 1 : false);
  aplikacja.disable('x-powered-by');
  aplikacja.use(helmet());
  aplikacja.use(express.json({ limit: '10kb' }));
  aplikacja.use('/api/auth', (_zadanie, odpowiedz, dalej) => {
    odpowiedz.set('Cache-Control', 'no-store');
    dalej();
  });
  aplikacja.use('/api/auth', (zadanie, odpowiedz, dalej) => {
    if (konfiguracja.czyProdukcja && zadanie.method !== 'GET' && !czyZgodnePochodzenie(zadanie)) {
      return odpowiedz.status(403).json({ blad: 'Żądanie pochodzi z niedozwolonego źródła.' });
    }
    return dalej();
  });

  const ustawCiasteczkoSesji = (odpowiedz, token) => {
    odpowiedz.cookie(nazwaCiasteczka, token, {
      httpOnly: true,
      secure: konfiguracja.czyProdukcja,
      sameSite: 'strict',
      maxAge: konfiguracja.czasSesjiDni * 24 * 60 * 60 * 1000,
      path: '/api',
    });
  };

  const wyczyscCiasteczkoSesji = odpowiedz => {
    odpowiedz.clearCookie(nazwaCiasteczka, {
      httpOnly: true,
      secure: konfiguracja.czyProdukcja,
      sameSite: 'strict',
      path: '/api',
    });
  };

  const pobierzUzytkownikaZSesji = async zadanie => {
    const token = pobierzCiasteczka(zadanie.headers.cookie)[nazwaCiasteczka];
    if (!token) return { uzytkownik: null, maToken: false };
    const wynik = await pula.query(
      'SELECT u.id, u.email, u.nazwa_wyswietlana, u.role FROM sesje s JOIN uzytkownicy u ON u.id = s.uzytkownik_id WHERE s.hash_tokenu = $1 AND s.wygasa_o > NOW()',
      [hashujToken(token)],
    );
    return {
      uzytkownik: wynik.rowCount ? danePubliczneUzytkownika(wynik.rows[0]) : null,
      maToken: true,
    };
  };

  const ogranicznikLogowania = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { blad: 'Spróbuj ponownie za kilka minut.' },
  });

  aplikacja.get('/api/health', async (_zadanie, odpowiedz) => {
    try {
      await pula.query('SELECT 1');
      return odpowiedz.status(200).json({ stan: 'gotowy' });
    } catch {
      return odpowiedz.status(503).json({ stan: 'niedostepny' });
    }
  });

  aplikacja.post('/api/auth/login', ogranicznikLogowania, async (zadanie, odpowiedz, dalej) => {
    try {
      const email = typeof zadanie.body?.email === 'string' ? zadanie.body.email.trim().toLowerCase() : '';
      const haslo = typeof zadanie.body?.haslo === 'string' ? zadanie.body.haslo : '';
      if (!czyPoprawneDaneLogowania(email, haslo)) {
        return odpowiedz.status(401).json(publicznyBladLogowania);
      }

      const wynik = await pula.query(
        'SELECT id, email, nazwa_wyswietlana, role, hash_hasla FROM uzytkownicy WHERE email = $1',
        [email],
      );
      const konto = wynik.rows[0];
      const zgodneHaslo = await bcrypt.compare(haslo, konto?.hash_hasla ?? hashHaslaZastepczego);
      if (!konto || !zgodneHaslo) {
        return odpowiedz.status(401).json(publicznyBladLogowania);
      }

      const token = `${crypto.randomUUID()}.${crypto.randomBytes(32).toString('base64url')}`;
      const wygasaO = new Date(Date.now() + konfiguracja.czasSesjiDni * 24 * 60 * 60 * 1000);
      await pula.query('DELETE FROM sesje WHERE wygasa_o <= NOW()');
      await pula.query(
        'INSERT INTO sesje (id, uzytkownik_id, hash_tokenu, wygasa_o) VALUES ($1, $2, $3, $4)',
        [crypto.randomUUID(), konto.id, hashujToken(token), wygasaO],
      );
      ustawCiasteczkoSesji(odpowiedz, token);
      return odpowiedz.json({ uzytkownik: danePubliczneUzytkownika(konto) });
    } catch (blad) {
      return dalej(blad);
    }
  });

  aplikacja.get('/api/auth/session', async (zadanie, odpowiedz, dalej) => {
    try {
      const { uzytkownik, maToken } = await pobierzUzytkownikaZSesji(zadanie);
      if (maToken && !uzytkownik) wyczyscCiasteczkoSesji(odpowiedz);
      return odpowiedz.json({ uzytkownik });
    } catch (blad) {
      return dalej(blad);
    }
  });

  aplikacja.post('/api/auth/logout', async (zadanie, odpowiedz) => {
    const token = pobierzCiasteczka(zadanie.headers.cookie)[nazwaCiasteczka];
    if (token) {
      try {
        await pula.query('DELETE FROM sesje WHERE hash_tokenu = $1', [hashujToken(token)]);
      } catch {
        // Wylogowanie pozostaje idempotentne i nie ujawnia stanu sesji ani bazy.
      }
    }
    wyczyscCiasteczkoSesji(odpowiedz);
    return odpowiedz.status(204).end();
  });

  aplikacja.use('/api', (_zadanie, odpowiedz) => odpowiedz.status(404).json({ blad: 'Nie znaleziono zasobu.' }));

  if (konfiguracja.czyProdukcja) {
    aplikacja.use(express.static(path.join(katalogAplikacji, 'dist')));
    aplikacja.use((zadanie, odpowiedz) => {
      if (zadanie.method === 'GET' && zadanie.accepts('html')) {
        return odpowiedz.sendFile(path.join(katalogAplikacji, 'dist', 'index.html'));
      }
      return odpowiedz.status(404).json({ blad: 'Nie znaleziono zasobu.' });
    });
  }

  aplikacja.use((blad, _zadanie, odpowiedz, _dalej) => {
    if (blad instanceof SyntaxError && 'body' in blad) {
      return odpowiedz.status(400).json({ blad: 'Niepoprawny format JSON.' });
    }
    console.error('Błąd serwera:', blad instanceof Error ? blad.message : 'nieznany błąd');
    return odpowiedz.status(500).json({ blad: 'Wystąpił błąd serwera.' });
  });

  return aplikacja;
}
