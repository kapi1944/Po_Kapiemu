import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pg from 'pg';
const katalogSerwera = path.dirname(fileURLToPath(import.meta.url));
const katalogAplikacji = path.resolve(katalogSerwera, '..');
const port = Number(process.env.PORT ?? 3000);
const kosztBcrypt = Number(process.env.BCRYPT_KOSZT ?? 12);
const czasSesjiDni = Number(process.env.CZAS_SESJI_DNI ?? 7);
const czyProdukcja = process.env.NODE_ENV === 'production';
const nazwaCiasteczka = 'pk_sesja';
if (!process.env.DATABASE_URL) throw new Error('Brakuje zmiennej DATABASE_URL.');
if (!Number.isInteger(kosztBcrypt) || kosztBcrypt < 12) throw new Error('BCRYPT_KOSZT musi wynosić co najmniej 12.');
const pula = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const aplikacja = express();
aplikacja.set('trust proxy', 1);
aplikacja.disable('x-powered-by');
aplikacja.use(helmet());
aplikacja.use(express.json({ limit: '10kb' }));
function pobierzCiasteczka(naglowek = '') {
  return Object.fromEntries(naglowek.split(';').map(czesc => {
    const [klucz, ...wartosci] = czesc.trim().split('=');
    return [klucz, decodeURIComponent(wartosci.join('='))];
  }).filter(([klucz]) => klucz));
}
function hashujToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
function ustawCiasteczkoSesji(odpowiedz, token) {
  odpowiedz.cookie(nazwaCiasteczka, token, { httpOnly: true, secure: czyProdukcja, sameSite: 'strict', maxAge: czasSesjiDni * 24 * 60 * 60 * 1000, path: '/api' });
}
function wyczyscCiasteczkoSesji(odpowiedz) {
  odpowiedz.clearCookie(nazwaCiasteczka, { httpOnly: true, secure: czyProdukcja, sameSite: 'strict', path: '/api' });
}
function danePubliczneUzytkownika(wiersz) {
  return { id: wiersz.id, email: wiersz.email, nazwaWyswietlana: wiersz.nazwa_wyswietlana, role: wiersz.role };
}
async function pobierzUzytkownikaZSesji(zadanie) {
  const token = pobierzCiasteczka(zadanie.headers.cookie)[nazwaCiasteczka];
  if (!token) return null;
  const wynik = await pula.query(`SELECT u.id, u.email, u.nazwa_wyswietlana, u.role FROM sesje s JOIN uzytkownicy u ON u.id = s.uzytkownik_id WHERE s.hash_tokenu = $1 AND s.wygasa_o > NOW()`, [hashujToken(token)]);
  return wynik.rowCount ? danePubliczneUzytkownika(wynik.rows[0]) : null;
}
const ogranicznikLogowania = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { blad: 'Spróbuj ponownie za kilka minut.' } });
aplikacja.post('/api/auth/login', ogranicznikLogowania, async (zadanie, odpowiedz, dalej) => {
  try {
    const email = typeof zadanie.body?.email === 'string' ? zadanie.body.email.trim().toLowerCase() : '';
    const haslo = typeof zadanie.body?.haslo === 'string' ? zadanie.body.haslo : '';
    if (!email || !haslo) return odpowiedz.status(401).json({ blad: 'Nieprawidłowy e-mail lub hasło.' });
    const wynik = await pula.query('SELECT id, email, nazwa_wyswietlana, role, hash_hasla FROM uzytkownicy WHERE email = $1', [email]);
    const konto = wynik.rows[0];
    if (!konto || !await bcrypt.compare(haslo, konto.hash_hasla)) return odpowiedz.status(401).json({ blad: 'Nieprawidłowy e-mail lub hasło.' });
    const token = `${crypto.randomUUID()}.${crypto.randomBytes(32).toString('base64url')}`;
    const wygasaO = new Date(Date.now() + czasSesjiDni * 24 * 60 * 60 * 1000);
    await pula.query('DELETE FROM sesje WHERE wygasa_o <= NOW()');
    await pula.query('INSERT INTO sesje (id, uzytkownik_id, hash_tokenu, wygasa_o) VALUES ($1, $2, $3, $4)', [crypto.randomUUID(), konto.id, hashujToken(token), wygasaO]);
    ustawCiasteczkoSesji(odpowiedz, token);
    return odpowiedz.json({ uzytkownik: danePubliczneUzytkownika(konto) });
  } catch (blad) { return dalej(blad); }
});
aplikacja.get('/api/auth/session', async (zadanie, odpowiedz, dalej) => {
  try {
    const uzytkownik = await pobierzUzytkownikaZSesji(zadanie);
    if (!uzytkownik) wyczyscCiasteczkoSesji(odpowiedz);
    return odpowiedz.json({ uzytkownik });
  } catch (blad) { return dalej(blad); }
});
aplikacja.post('/api/auth/logout', async (zadanie, odpowiedz, dalej) => {
  try {
    const token = pobierzCiasteczka(zadanie.headers.cookie)[nazwaCiasteczka];
    if (token) await pula.query('DELETE FROM sesje WHERE hash_tokenu = $1', [hashujToken(token)]);
    wyczyscCiasteczkoSesji(odpowiedz);
    return odpowiedz.status(204).end();
  } catch (blad) { return dalej(blad); }
});
if (czyProdukcja) {
  aplikacja.use(express.static(path.join(katalogAplikacji, 'dist')));
  aplikacja.use((zadanie, odpowiedz) => {
    if (zadanie.method === 'GET' && zadanie.accepts('html')) return odpowiedz.sendFile(path.join(katalogAplikacji, 'dist', 'index.html'));
    return odpowiedz.status(404).json({ blad: 'Nie znaleziono zasobu.' });
  });
}
aplikacja.use((blad, _zadanie, odpowiedz, _dalej) => {
  console.error('Błąd serwera:', blad);
  return odpowiedz.status(500).json({ blad: 'Wystąpił błąd serwera.' });
});
aplikacja.listen(port, () => console.log(`Backend działa na porcie ${port}.`));
