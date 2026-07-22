import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icons';
import { etykietyTypowTresci } from '../../data/siteData';
import { wyszukaj, type TypWynikuWyszukiwania, type WynikWyszukiwania } from './silnikWyszukiwania';

const etykietyTypowWynikow: Record<TypWynikuWyszukiwania, string> = { ...etykietyTypowTresci, project: 'Projekty' };

function grupujWyniki(wyniki: WynikWyszukiwania[]) {
  return wyniki.reduce<Partial<Record<TypWynikuWyszukiwania, WynikWyszukiwania[]>>>((grupy, wynik) => {
    (grupy[wynik.typ] ??= []).push(wynik);
    return grupy;
  }, {});
}

export function SzybkieWyszukiwanie() {
  const [otwarte, ustawOtwarte] = useState(false);
  const [fraza, ustawFraze] = useState('');
  const [aktywnyIndeks, ustawAktywnyIndeks] = useState(0);
  const poleWyszukiwaniaRef = useRef<HTMLInputElement>(null);
  const nawiguj = useNavigate();
  const wyniki = useMemo(() => wyszukaj(fraza), [fraza]);
  const grupyWynikow = useMemo(() => grupujWyniki(wyniki), [wyniki]);

  useEffect(() => {
    const obsluzSkrot = (zdarzenie: globalThis.KeyboardEvent) => {
      if (zdarzenie.ctrlKey && zdarzenie.key.toLowerCase() === 'k') { zdarzenie.preventDefault(); ustawOtwarte(true); }
      if (zdarzenie.key === 'Escape') ustawOtwarte(false);
    };
    document.addEventListener('keydown', obsluzSkrot);
    return () => document.removeEventListener('keydown', obsluzSkrot);
  }, []);

  useEffect(() => { if (otwarte) poleWyszukiwaniaRef.current?.focus(); }, [otwarte]);
  useEffect(() => { ustawAktywnyIndeks(0); }, [fraza]);

  const otworzWynik = (wynik: WynikWyszukiwania) => { nawiguj(wynik.url); ustawOtwarte(false); };
  const obsluzKlawiszPola = (zdarzenie: KeyboardEvent<HTMLInputElement>) => {
    if (!wyniki.length) return;
    if (zdarzenie.key === 'ArrowDown') { zdarzenie.preventDefault(); ustawAktywnyIndeks(obecny => (obecny + 1) % wyniki.length); }
    if (zdarzenie.key === 'ArrowUp') { zdarzenie.preventDefault(); ustawAktywnyIndeks(obecny => (obecny - 1 + wyniki.length) % wyniki.length); }
    if (zdarzenie.key === 'Enter') { zdarzenie.preventDefault(); otworzWynik(wyniki[aktywnyIndeks]); }
  };

  return <>
    <button type="button" className="topbar-search" aria-haspopup="dialog" aria-expanded={otwarte} onClick={() => ustawOtwarte(true)}><Icon name="search" size={16}/><span>Szukaj projektów, pomysłów…</span><kbd>Ctrl K</kbd></button>
    {otwarte && <div className="wyszukiwanie-overlay" role="presentation" onMouseDown={() => ustawOtwarte(false)}>
      <section className="paleta-wyszukiwania" role="dialog" aria-modal="true" aria-labelledby="tytul-szybkiego-wyszukiwania" onMouseDown={zdarzenie => zdarzenie.stopPropagation()}>
        <h1 className="tylko-dla-czytnika" id="tytul-szybkiego-wyszukiwania">Szybkie wyszukiwanie</h1>
        <div className="paleta-wyszukiwania__pole"><Icon name="search" size={18}/><input ref={poleWyszukiwaniaRef} value={fraza} onChange={zdarzenie => ustawFraze(zdarzenie.target.value)} onKeyDown={obsluzKlawiszPola} placeholder="Szukaj projektów, treści i recenzji…" aria-label="Szukaj" aria-controls="wyniki-szybkiego-wyszukiwania" aria-activedescendant={wyniki[aktywnyIndeks] ? 'wynik-' + wyniki[aktywnyIndeks].id : undefined}/><kbd>Esc</kbd></div>
        <div className="paleta-wyszukiwania__wyniki" id="wyniki-szybkiego-wyszukiwania" role="listbox" aria-label="Wyniki wyszukiwania">
          {!fraza.trim() && <p className="paleta-wyszukiwania__podpowiedz">Wpisz frazę, aby przeszukać projekty, treści i recenzje.</p>}
          {fraza.trim() && !wyniki.length && <p className="paleta-wyszukiwania__podpowiedz">Brak wyników dla tej frazy.</p>}
          {Object.entries(grupyWynikow).map(([typ, wynikiTypu]) => <section key={typ} className="grupa-wynikow"><h2>{etykietyTypowWynikow[typ as TypWynikuWyszukiwania]}</h2>{wynikiTypu?.map(wynik => {
            const indeks = wyniki.findIndex(element => element.id === wynik.id);
            return <button type="button" className={'wynik-wyszukiwania ' + (aktywnyIndeks === indeks ? 'aktywny' : '')} id={'wynik-' + wynik.id} role="option" aria-selected={aktywnyIndeks === indeks} key={wynik.id} onMouseMove={() => ustawAktywnyIndeks(indeks)} onClick={() => otworzWynik(wynik)}><span className="wynik-wyszukiwania__typ">{etykietyTypowWynikow[wynik.typ]}</span><span className="wynik-wyszukiwania__tresc"><b>{wynik.tytul}</b><small>{wynik.opis}</small></span>{wynik.kategoria && <span className="wynik-wyszukiwania__kategoria">{wynik.kategoria}</span>}</button>;
          })}</section>)}
        </div>
        <div className="paleta-wyszukiwania__stopka"><span><kbd>↑↓</kbd> nawigacja <kbd>↵</kbd> otwórz</span><button type="button" className="paleta-wyszukiwania__wszystkie" onClick={() => { nawiguj('/szukaj?q=' + encodeURIComponent(fraza)); ustawOtwarte(false); }}>Otwórz wszystkie wyniki</button></div>
      </section>
    </div>}
  </>;
}
