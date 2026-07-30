const srodowiska = new Set(['development', 'test', 'production']);

function pobierzLiczbeCalkowita(nazwa, wartosc, domyslna, minimum, maksimum = Number.MAX_SAFE_INTEGER) {
  const liczba = Number(wartosc ?? domyslna);
  if (!Number.isInteger(liczba) || liczba < minimum || liczba > maksimum) {
    throw new Error(`${nazwa} musi być liczbą całkowitą z zakresu ${minimum}–${maksimum}.`);
  }
  return liczba;
}

export function wczytajKonfiguracje(srodowisko = process.env) {
  const adresBazy = srodowisko.DATABASE_URL?.trim();
  if (!adresBazy) {
    throw new Error('Brakuje wymaganej zmiennej DATABASE_URL.');
  }

  const tryb = srodowisko.NODE_ENV?.trim() || 'development';
  if (!srodowiska.has(tryb)) {
    throw new Error('NODE_ENV musi mieć wartość development, test albo production.');
  }

  return {
    adresBazy,
    port: pobierzLiczbeCalkowita('PORT', srodowisko.PORT, 3000, 1, 65_535),
    kosztBcrypt: pobierzLiczbeCalkowita('BCRYPT_KOSZT', srodowisko.BCRYPT_KOSZT, 12, 12, 31),
    czasSesjiDni: pobierzLiczbeCalkowita('CZAS_SESJI_DNI', srodowisko.CZAS_SESJI_DNI, 7, 1, 365),
    tryb,
    czyProdukcja: tryb === 'production',
  };
}
