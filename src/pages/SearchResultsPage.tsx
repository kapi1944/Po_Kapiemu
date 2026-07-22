import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { etykietyTypowTresci } from '../data/siteData';
import { wyszukaj, type TypWynikuWyszukiwania, type WynikWyszukiwania } from '../moduly/wyszukiwanie/silnikWyszukiwania';

type ZakladkaWyszukiwania = 'all' | 'project' | 'content' | 'review' | 'test' | 'comparison';

const zakladki: Array<{ wartosc: ZakladkaWyszukiwania; etykieta: string }> = [
  { wartosc: 'all', etykieta: 'Wszystkie' },
  { wartosc: 'project', etykieta: 'Projekty' },
  { wartosc: 'content', etykieta: 'Treści' },
  { wartosc: 'review', etykieta: 'Recenzje' },
  { wartosc: 'test', etykieta: 'Testy' },
  { wartosc: 'comparison', etykieta: 'Porównania' },
];

const etykietyTypowWynikow: Record<TypWynikuWyszukiwania, string> = { ...etykietyTypowTresci, project: 'Projekt' };

function filtrujWedlugZakladki(wyniki: WynikWyszukiwania[], zakladka: ZakladkaWyszukiwania) {
  if (zakladka === 'all') return wyniki;
  if (zakladka === 'content') return wyniki.filter(wynik => ['update', 'video', 'article', 'material'].includes(wynik.typ));
  return wyniki.filter(wynik => wynik.typ === zakladka);
}

export function SearchResultsPage() {
  const [parametryWyszukiwania, ustawParametryWyszukiwania] = useSearchParams();
  const [zakladka, ustawZakladke] = useState<ZakladkaWyszukiwania>('all');
  const fraza = parametryWyszukiwania.get('q') ?? '';
  const wszystkieWyniki = wyszukaj(fraza);
  const wyniki = filtrujWedlugZakladki(wszystkieWyniki, zakladka);

  return <div className="page-wrap inner-page strona-wynikow-wyszukiwania">
    <div className="page-hero"><span className="section-kicker">WYSZUKIWANIE</span><h1>Znajdź to, czego szukasz.</h1><p>Przeszukuj projekty, treści oraz materiały recenzenckie.</p></div>
    <label className="pelne-wyszukiwanie__pole"><Icon name="search" size={18}/><input value={fraza} onChange={zdarzenie => ustawParametryWyszukiwania(zdarzenie.target.value ? { q: zdarzenie.target.value } : {})} placeholder="Szukaj projektów, treści i recenzji…" aria-label="Fraza wyszukiwania"/></label>
    <div className="segmented zakladki-wyszukiwania" role="tablist" aria-label="Typ wyników">{zakladki.map(element => <button type="button" role="tab" aria-selected={zakladka === element.wartosc} className={zakladka === element.wartosc ? 'active' : ''} key={element.wartosc} onClick={() => ustawZakladke(element.wartosc)}>{element.etykieta}</button>)}</div>
    {!fraza.trim() && <section className="stan-wyszukiwania"><Icon name="search" size={25}/><h2>Wpisz frazę wyszukiwania</h2><p>Wyniki pojawią się tutaj i zostaną zapisane w adresie strony.</p></section>}
    {fraza.trim() && !wyniki.length && <section className="stan-wyszukiwania"><Icon name="search" size={25}/><h2>Brak wyników</h2><p>Nie znaleziono wyników dla frazy „{fraza}”.</p></section>}
    {fraza.trim() && wyniki.length > 0 && <section aria-live="polite"><p className="liczba-wynikow">Znaleziono: {wyniki.length} {wyniki.length === 1 ? 'wynik' : 'wyniki'}{zakladka !== 'all' && ` w kategorii ${zakladki.find(element => element.wartosc === zakladka)?.etykieta}` }.</p><div className="lista-wynikow-wyszukiwania">{wyniki.map(wynik => <Link to={wynik.url} className="karta-wyniku-wyszukiwania" key={wynik.id}>{wynik.miniatura && <img src={wynik.miniatura} alt=""/>}<div className="karta-wyniku-wyszukiwania__tresc"><span className="karta-wyniku-wyszukiwania__typ">{etykietyTypowWynikow[wynik.typ]}</span><h2>{wynik.tytul}</h2><p>{wynik.opis}</p><div className="karta-wyniku-wyszukiwania__metadane">{wynik.kategoria && <span>{wynik.kategoria}</span>}{wynik.tagi?.map(tag => <span key={tag}>{tag}</span>)}</div></div><Icon name="arrow" size={16}/></Link>)}</div></section>}
  </div>;
}
