import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import pg from 'pg';
const [emailArgument, nazwaArgument, haslo, roleArgument = 'uzytkownik'] = process.argv.slice(2);
const dozwoloneRole = new Set(['wlasciciel', 'administrator', 'moderator', 'redaktor', 'uzytkownik', 'widz']);
const email = emailArgument?.trim().toLowerCase();
const nazwaWyswietlana = nazwaArgument?.trim();
const role = roleArgument.split(',').map(rola => rola.trim()).filter(Boolean);
const kosztBcrypt = Number(process.env.BCRYPT_KOSZT ?? 12);
if (!process.env.DATABASE_URL) throw new Error('Brakuje zmiennej DATABASE_URL.');
if (!email || !nazwaWyswietlana || !haslo || haslo.length < 12 || !role.length || role.some(rola => !dozwoloneRole.has(rola))) {
  throw new Error('Użycie: npm run uzytkownik:utworz -- e-mail "Nazwa" "hasło-min-12" rola[,rola]');
}
const pula = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  const hashHasla = await bcrypt.hash(haslo, kosztBcrypt);
  await pula.query('INSERT INTO uzytkownicy (id, email, nazwa_wyswietlana, role, hash_hasla) VALUES ($1, $2, $3, $4, $5)', [crypto.randomUUID(), email, nazwaWyswietlana, role, hashHasla]);
  console.log(`Utworzono konto ${email}.`);
} finally { await pula.end(); }
