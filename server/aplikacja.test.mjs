// @vitest-environment node
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { hashujToken, utworzAplikacje } from './aplikacja.mjs';

const konfiguracjaTestowa = {
  czyProdukcja:false,
  czasSesjiDni:7,
  kosztBcrypt:12,
  tryb:'test',
};

let hashPoprawnegoHasla;

beforeAll(async () => {
  hashPoprawnegoHasla = await bcrypt.hash('bardzo-dlugie-haslo', 4);
});

function konto(role = ['uzytkownik']) {
  return {
    id:'uzytkownik-1',
    email:'osoba@example.com',
    nazwa_wyswietlana:'Osoba testowa',
    role,
    hash_hasla:hashPoprawnegoHasla,
  };
}

function utworzPule(obsluga) {
  return { query:vi.fn(obsluga) };
}

function aplikacjaZPula(obsluga, nadpisanie = {}) {
  const pula = utworzPule(obsluga);
  return {
    aplikacja:utworzAplikacje({ pula, konfiguracja:{ ...konfiguracjaTestowa, ...nadpisanie } }),
    pula,
  };
}

describe('API autoryzacji', () => {
  it('odrzuca brak e-maila lub hasła kodem 401', async () => {
    const { aplikacja, pula } = aplikacjaZPula(async () => ({ rowCount:0, rows:[] }));
    const odpowiedz = await request(aplikacja).post('/api/auth/login').send({ email:'' });

    expect(odpowiedz.status).toBe(401);
    expect(odpowiedz.body).toEqual({ blad:'Nieprawidłowy e-mail lub hasło.' });
    expect(pula.query).not.toHaveBeenCalled();
  });

  it('zwraca tę samą odpowiedź dla nieistniejącego konta i błędnego hasła', async () => {
    const nieistniejace = aplikacjaZPula(async () => ({ rowCount:0, rows:[] })).aplikacja;
    const bledne = aplikacjaZPula(async () => ({ rowCount:1, rows:[konto()] })).aplikacja;

    const odpowiedzA = await request(nieistniejace).post('/api/auth/login').send({
      email:'brak@example.com',
      haslo:'bardzo-dlugie-haslo',
    });
    const odpowiedzB = await request(bledne).post('/api/auth/login').send({
      email:'osoba@example.com',
      haslo:'inne-bardzo-dlugie-haslo',
    });

    expect(odpowiedzA.status).toBe(401);
    expect(odpowiedzB.status).toBe(401);
    expect(odpowiedzA.body).toEqual(odpowiedzB.body);
  });

  it('ustawia HttpOnly i SameSite Strict po poprawnym logowaniu', async () => {
    const { aplikacja } = aplikacjaZPula(async zapytanie => {
      if (zapytanie.startsWith('SELECT id')) return { rowCount:1, rows:[konto()] };
      return { rowCount:1, rows:[] };
    });

    const odpowiedz = await request(aplikacja).post('/api/auth/login').send({
      email:'osoba@example.com',
      haslo:'bardzo-dlugie-haslo',
    });
    const ciasteczko = odpowiedz.headers['set-cookie'][0];

    expect(odpowiedz.status).toBe(200);
    expect(ciasteczko).toContain('HttpOnly');
    expect(ciasteczko).toContain('SameSite=Strict');
  });

  it('ustawia Secure w trybie produkcyjnym', async () => {
    const { aplikacja } = aplikacjaZPula(async zapytanie => {
      if (zapytanie.startsWith('SELECT id')) return { rowCount:1, rows:[konto()] };
      return { rowCount:1, rows:[] };
    }, { czyProdukcja:true, tryb:'production' });

    const odpowiedz = await request(aplikacja)
      .post('/api/auth/login')
      .set('Host', 'example.test')
      .set('Origin', 'https://example.test')
      .send({ email:'osoba@example.com', haslo:'bardzo-dlugie-haslo' });

    expect(odpowiedz.headers['set-cookie'][0]).toContain('Secure');
  });

  it('zapisuje w bazie hash tokenu zamiast surowego tokenu', async () => {
    let parametryZapisu;
    const { aplikacja } = aplikacjaZPula(async (zapytanie, parametry) => {
      if (zapytanie.startsWith('SELECT id')) return { rowCount:1, rows:[konto()] };
      if (zapytanie.startsWith('INSERT INTO sesje')) parametryZapisu = parametry;
      return { rowCount:1, rows:[] };
    });

    const odpowiedz = await request(aplikacja).post('/api/auth/login').send({
      email:'osoba@example.com',
      haslo:'bardzo-dlugie-haslo',
    });
    const token = odpowiedz.headers['set-cookie'][0].split(';')[0].split('=')[1];

    expect(parametryZapisu[2]).not.toBe(token);
    expect(parametryZapisu[2]).toBe(hashujToken(token));
    expect(parametryZapisu[2]).toMatch(/^[a-f0-9]{64}$/);
  });

  it('zwraca pustą sesję bez ciasteczka', async () => {
    const { aplikacja, pula } = aplikacjaZPula(async () => ({ rowCount:0, rows:[] }));
    const odpowiedz = await request(aplikacja).get('/api/auth/session');

    expect(odpowiedz.status).toBe(200);
    expect(odpowiedz.body).toEqual({ uzytkownik:null });
    expect(pula.query).not.toHaveBeenCalled();
  });

  it('czyści ciasteczko wygasłej lub nieprawidłowej sesji', async () => {
    const { aplikacja } = aplikacjaZPula(async () => ({ rowCount:0, rows:[] }));
    const odpowiedz = await request(aplikacja).get('/api/auth/session').set('Cookie', 'pk_sesja=stary-token');

    expect(odpowiedz.body).toEqual({ uzytkownik:null });
    expect(odpowiedz.headers['set-cookie'][0]).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/);
  });

  it('wylogowuje wyłącznie bieżącą sesję', async () => {
    const { aplikacja, pula } = aplikacjaZPula(async () => ({ rowCount:1, rows:[] }));
    await request(aplikacja).post('/api/auth/logout').set('Cookie', 'pk_sesja=token-biezacy');

    expect(pula.query).toHaveBeenCalledTimes(1);
    expect(pula.query).toHaveBeenCalledWith(
      'DELETE FROM sesje WHERE hash_tokenu = $1',
      [hashujToken('token-biezacy')],
    );
  });

  it('zwraca 400 dla niepoprawnego JSON', async () => {
    const { aplikacja } = aplikacjaZPula(async () => ({ rowCount:0, rows:[] }));
    const odpowiedz = await request(aplikacja)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');

    expect(odpowiedz.status).toBe(400);
    expect(odpowiedz.body).toEqual({ blad:'Niepoprawny format JSON.' });
  });

  it('nie ujawnia szczegółów błędu bazy', async () => {
    const bladKonsoli = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { aplikacja } = aplikacjaZPula(async () => {
      throw new Error('tajny szczegół bazy');
    });
    const odpowiedz = await request(aplikacja).post('/api/auth/login').send({
      email:'osoba@example.com',
      haslo:'bardzo-dlugie-haslo',
    });

    expect(odpowiedz.status).toBe(500);
    expect(odpowiedz.body).toEqual({ blad:'Wystąpił błąd serwera.' });
    expect(odpowiedz.text).not.toContain('tajny szczegół bazy');
    bladKonsoli.mockRestore();
  });

  it('health zwraca 200 dla działającej bazy i 503 dla niedostępnej', async () => {
    const gotowa = aplikacjaZPula(async () => ({ rowCount:1, rows:[{ '?column?':1 }] })).aplikacja;
    const niedostepna = aplikacjaZPula(async () => {
      throw new Error('brak połączenia');
    }).aplikacja;

    expect((await request(gotowa).get('/api/health')).status).toBe(200);
    expect((await request(niedostepna).get('/api/health')).status).toBe(503);
  });

  it('odfiltrowuje nieznane role w odpowiedzi sesji', async () => {
    const { aplikacja } = aplikacjaZPula(async () => ({
      rowCount:1,
      rows:[konto(['administrator', 'rola-zewnetrzna', 'administrator'])],
    }));
    const odpowiedz = await request(aplikacja).get('/api/auth/session').set('Cookie', 'pk_sesja=token');

    expect(odpowiedz.body.uzytkownik.role).toEqual(['administrator']);
  });
});
