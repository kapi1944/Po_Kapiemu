import { porownanieAdapterowUsbCJack } from '../porownania/daneAdapterowUsbCJack';
import { contentItems, etykietyTypowMaterialowRecenzenckich, etykietyTypowTresci, nazwyKategorii, projects, redakcyjneTresci, reviews, type StatusTresci, type TypMaterialuRecenzenckiego, type TypTresci } from '../../data/siteData';

export type ZakresWyszukiwania = 'publiczny' | 'redakcyjny';
export type TypWynikuWyszukiwania = 'project' | TypTresci;

export type WynikWyszukiwania = {
  id: string;
  typ: TypWynikuWyszukiwania;
  tytul: string;
  opis: string;
  url: string;
  tagi?: string[];
  kategoria?: string;
  miniatura?: string;
  status: StatusTresci | 'published';
};

function normalizujTekst(tekst: string) {
  return tekst.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl-PL');
}

function jestPubliczny(status: StatusTresci | 'published') {
  return status === 'published';
}

function utworzWynikiProjektow(): WynikWyszukiwania[] {
  return projects.filter(projekt => !projekt.locked).map(projekt => ({ id: `project-${projekt.slug}`, typ: 'project', tytul: projekt.title, opis: projekt.description, url: `/projekty/${projekt.slug}`, tagi: [projekt.eyebrow, ...projekt.highlights], kategoria: nazwyKategorii[projekt.category], miniatura: projekt.image, status: 'published' }));
}

function utworzWynikiTresci() {
  return [...contentItems, ...redakcyjneTresci].map(material => ({ id: `content-${material.id}`, typ: material.type, tytul: material.title, opis: material.meta, url: `/tresci/${material.slug}`, tagi: [material.tag, etykietyTypowTresci[material.type]], status: material.status }));
}

function utworzWynikiMaterialowRecenzenckich(): WynikWyszukiwania[] {
  return reviews.map(recenzja => ({ id: `review-${recenzja.slug}`, typ: recenzja.typ, tytul: recenzja.title, opis: recenzja.verdict, url: `/recenzje/${recenzja.slug}`, tagi: [etykietyTypowMaterialowRecenzenckich[recenzja.typ as TypMaterialuRecenzenckiego]], kategoria: recenzja.category, status: recenzja.status }));
}

function utworzWynikiPorownan(): WynikWyszukiwania[] {
  return [{ id: 'comparison-' + porownanieAdapterowUsbCJack.id, typ: 'comparison', tytul: porownanieAdapterowUsbCJack.nazwa, opis: porownanieAdapterowUsbCJack.opis, url: '/porownania/' + porownanieAdapterowUsbCJack.slug, tagi: ['Adaptery', 'DAC', 'USB-C', 'jack 3,5 mm'], status: 'published' }];
}

function sprawdzUnikalnoscAdresow(wyniki: WynikWyszukiwania[]) {
  const adresy = new Set<string>();
  for (const wynik of wyniki) {
    if (adresy.has(wynik.url)) throw new Error('Powielony adres publikacji: ' + wynik.url);
    adresy.add(wynik.url);
  }
}

export function pobierzWynikiWyszukiwania(zakres: ZakresWyszukiwania = 'publiczny'): WynikWyszukiwania[] {
  const wyniki = [...utworzWynikiProjektow(), ...utworzWynikiTresci(), ...utworzWynikiMaterialowRecenzenckich(), ...utworzWynikiPorownan()];
  sprawdzUnikalnoscAdresow(wyniki);
  return zakres === 'publiczny' ? wyniki.filter(wynik => jestPubliczny(wynik.status)) : wyniki;
}

export function wyszukaj(tekst: string, zakres: ZakresWyszukiwania = 'publiczny', wyniki = pobierzWynikiWyszukiwania(zakres)): WynikWyszukiwania[] {
  const frazy = normalizujTekst(tekst).split(' ').filter(Boolean);
  if (!frazy.length) return [];
  return wyniki.filter(wynik => {
    const przeszukiwanyTekst = normalizujTekst([wynik.tytul, wynik.opis, wynik.kategoria, ...(wynik.tagi ?? [])].filter(Boolean).join(' '));
    return frazy.every(fraza => przeszukiwanyTekst.includes(fraza));
  });
}

export function pobierzFrazeZParametrowWyszukiwania(parametry: string | URLSearchParams) {
  const wartosc = typeof parametry === 'string' ? new URLSearchParams(parametry) : parametry;
  return wartosc.get('q') ?? '';
}