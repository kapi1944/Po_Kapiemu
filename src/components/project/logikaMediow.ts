export function czyBezpiecznyAdres(adres?: string) {
  if (!adres?.trim()) return false;
  try {
    const wynik = new URL(adres, 'https://po-kapiemu.local');
    return wynik.protocol === 'http:' || wynik.protocol === 'https:';
  } catch {
    return false;
  }
}
