import { porownanieAdapterowUsbCJack } from '../porownania/daneAdapterowUsbCJack';
import { contentItems, etykietyTypowMaterialowRecenzenckich, etykietyTypowTresci, nazwyKategorii, projects, reviews, type TypMaterialuRecenzenckiego, type TypTresci } from '../../data/siteData';

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
};

function normalizujTekst(tekst: string) {
  return tekst.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl-PL');
}

function utworzWynikiProjektow(): WynikWyszukiwania[] {
  return projects.map(projekt => ({
    id: `project-${projekt.slug}`,
    typ: 'project',
    tytul: projekt.title,
    opis: projekt.description,
    url: `/projekty/${projekt.slug}`,
    tagi: [projekt.eyebrow, ...projekt.highlights],
    kategoria: nazwyKategorii[projekt.category],
    miniatura: projekt.image,
  }));
}

function utworzWynikiTresci(): WynikWyszukiwania[] {
  return contentItems.map(material => ({
    id: `content-${material.id}`,
    typ: material.type,
    tytul: material.title,
    opis: material.meta,
    url: '/tresci',
    tagi: [material.tag, etykietyTypowTresci[material.type]],
  }));
}

function utworzWynikiMaterialowRecenzenckich(): WynikWyszukiwania[] {
  return reviews.map((recenzja, indeks) => ({
    id: `review-${indeks}-${normalizujTekst(recenzja.title).replace(/\s/g, '-')}`,
    typ: recenzja.typ,
    tytul: recenzja.title,
    opis: recenzja.verdict,
    url: '/recenzje',
    tagi: [etykietyTypowMaterialowRecenzenckich[recenzja.typ as TypMaterialuRecenzenckiego]],
    kategoria: recenzja.category,
  }));
}

function utworzWynikiPorownan(): WynikWyszukiwania[] {
  return [{ id: 'comparison-' + porownanieAdapterowUsbCJack.id, typ: 'comparison', tytul: porownanieAdapterowUsbCJack.nazwa, opis: porownanieAdapterowUsbCJack.opis, url: '/porownania/' + porownanieAdapterowUsbCJack.slug, tagi: ['Adaptery', 'DAC', 'USB-C', 'jack 3,5 mm'] }];
}

export function pobierzWynikiWyszukiwania(): WynikWyszukiwania[] {
  return [...utworzWynikiProjektow(), ...utworzWynikiTresci(), ...utworzWynikiMaterialowRecenzenckich(), ...utworzWynikiPorownan()];
}

export function wyszukaj(tekst: string, wyniki = pobierzWynikiWyszukiwania()): WynikWyszukiwania[] {
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
