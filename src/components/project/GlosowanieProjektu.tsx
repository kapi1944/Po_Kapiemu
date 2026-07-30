import { useEffect, useMemo, useState } from 'react';
import type { GlosowanieProjektu as DaneGlosowania } from '../../data/projectDetails';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { kluczGlosow, obliczProcent } from './logikaGlosowan';

function wczytajWybory(klucz: string) {
  try {
    const dane = JSON.parse(localStorage.getItem(klucz) ?? '{}');
    if (!dane || typeof dane !== 'object' || Array.isArray(dane)) return {};
    return Object.fromEntries(Object.entries(dane).filter(([, wartosc]) => typeof wartosc === 'string')) as Record<string, string>;
  } catch {
    return {};
  }
}

export function GlosowanieProjektu({ projectSlug, glosowania, uzytkownik, uprawnienia }: {
  projectSlug: string;
  glosowania: DaneGlosowania[];
  uzytkownik: Uzytkownik | null;
  uprawnienia: UprawnieniaUzytkownika;
}) {
  const identyfikatorUzytkownika = uzytkownik?.id ?? (uprawnienia.mozeGlosowac ? 'dev-user' : 'guest');
  const klucz = kluczGlosow(projectSlug, identyfikatorUzytkownika);
  const [wybory, ustawWybory] = useState<Record<string, string>>(() => wczytajWybory(klucz));
  const glosowanie = useMemo(() => glosowania.find(element => element.aktywne) ?? glosowania[0], [glosowania]);

  useEffect(() => {
    ustawWybory(wczytajWybory(klucz));
  }, [klucz]);

  if (!glosowanie) return null;

  const wybor = wybory[glosowanie.id];
  const suma = glosowanie.opcje.reduce((wynik, opcja) => wynik + opcja.glosy, 0) + (wybor ? 1 : 0);
  const pokazWyniki = Boolean(wybor) || !glosowanie.aktywne;
  const zaglosuj = (opcja: string) => {
    if (!uprawnienia.mozeGlosowac || wybor || !glosowanie.aktywne) return;
    const nowe = { ...wybory, [glosowanie.id]:opcja };
    ustawWybory(nowe);
    localStorage.setItem(klucz, JSON.stringify(nowe));
  };

  return <div className="lista-glosowan">
    <article className="glosowanie-projektu">
      <b>{glosowanie.pytanie}</b>
      {glosowanie.opis && <p>{glosowanie.opis}</p>}
      <div>{glosowanie.opcje.map(opcja => {
        const glosy = opcja.glosy + (wybor === opcja.id ? 1 : 0);
        const zablokowana = Boolean(wybor) || !glosowanie.aktywne || !uprawnienia.mozeGlosowac;
        return <button type="button" key={opcja.id} className={wybor === opcja.id ? 'wybrana' : ''} disabled={zablokowana} aria-pressed={wybor === opcja.id} onClick={() => zaglosuj(opcja.id)}>
          {opcja.obraz && <img src={opcja.obraz} alt={`Opcja: ${opcja.etykieta}`}/>}
          <span>{opcja.etykieta}</span>
          {pokazWyniki && <small>{glosy} głosów · {obliczProcent(glosy, suma)}%</small>}
        </button>;
      })}</div>
      {!uprawnienia.mozeGlosowac && glosowanie.aktywne && <small>{uzytkownik ? 'Twoja rola nie pozwala głosować.' : 'Zaloguj się, aby oddać głos.'}</small>}
      {wybor && glosowanie.aktywne && <small>Głos został zapisany i nie można go zmienić.</small>}
      {!glosowanie.aktywne && glosowanie.decyzjaAutora && <p><b>Decyzja autora:</b> {glosowanie.decyzjaAutora}</p>}
    </article>
  </div>;
}
