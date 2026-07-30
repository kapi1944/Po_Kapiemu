function pobierzTablice(klucz: string, magazyn: Storage) {
  const zapis = magazyn.getItem(klucz);
  if (zapis === null) return null;
  try {
    const dane = JSON.parse(zapis);
    return Array.isArray(dane) && dane.every(element => typeof element === 'string') ? dane as string[] : null;
  } catch {
    return null;
  }
}

export function kluczKolejnosciSekcji(slug: string) {
  return `pk-section-order-${slug}`;
}

export function kluczWyroznionychSekcji(slug: string) {
  return `pk-section-featured-${slug}`;
}

export function pobierzKolejnoscSekcji(slug: string, dostepne: string[], domyslne: string[], magazyn: Storage = localStorage) {
  const zapisane = pobierzTablice(kluczKolejnosciSekcji(slug), magazyn) ?? domyslne;
  const zbiorDostepnych = new Set(dostepne);
  const zachowane = zapisane.filter((id, indeks, lista) => zbiorDostepnych.has(id) && lista.indexOf(id) === indeks);
  return [...zachowane, ...dostepne.filter(id => !zachowane.includes(id))];
}

export function pobierzWyroznioneSekcje(slug: string, dostepne: string[], domyslne: string[], magazyn: Storage = localStorage) {
  const zapisane = pobierzTablice(kluczWyroznionychSekcji(slug), magazyn);
  const zrodlo = zapisane === null ? domyslne : zapisane;
  const zbiorDostepnych = new Set(dostepne);
  return zrodlo.filter((id, indeks, lista) => zbiorDostepnych.has(id) && lista.indexOf(id) === indeks);
}
