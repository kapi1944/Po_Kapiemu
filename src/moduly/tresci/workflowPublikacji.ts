import type { PublikacjaPlatformowa, StatusTresci } from '../../data/siteData';

export function obliczStatusTresci(statusReczny: StatusTresci, publikacje?: PublikacjaPlatformowa[]): StatusTresci {
  if (publikacje && publikacje.length > 0 && publikacje.every(publikacja => publikacja.status === 'published')) return 'published';
  return statusReczny;
}

export function normalizujKategorieTresci<T extends string>(kategoriaGlowna?: T, kategoriePomocnicze: T[] = []) {
  return [...new Set(kategoriePomocnicze.filter(kategoria => kategoria !== kategoriaGlowna))];
}
