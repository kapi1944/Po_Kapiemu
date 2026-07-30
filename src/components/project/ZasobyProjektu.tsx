import type { ElementListy, RolaWidza, SzczegolyProjektu } from '../../data/projectDetails';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { BlokadaDlaGoscia } from '../GuestLock';
import { KomentarzeProjektu } from './KomentarzeProjektu';
import { MediaProjektu } from './MediaProjektu';
import { czyBezpiecznyAdres } from './logikaMediow';

export function MaterialyProjektu({ szczegoly, rola }: { szczegoly:SzczegolyProjektu; rola:RolaWidza }) {
  const pliki = szczegoly.pliki ?? [];
  if (rola === 'guest') return <div className="blokada-materialow"><b>{pliki.length} dostępne materiały</b><BlokadaDlaGoscia tytul="Materiały dla zalogowanych" opis="Dodatkowe materiały można pobierać po zalogowaniu."/></div>;
  return <div className="lista-materialow">{pliki.map(plik => <article key={plik.id}>
    <span>{plik.kategoria}</span>
    <b>{plik.nazwa}</b>
    {plik.opis && <p>{plik.opis}</p>}
    <small>{[plik.rozmiar, plik.wersja && `wersja ${plik.wersja}`, plik.zgodnyZ && `zgodne z ${plik.zgodnyZ}`, plik.aktualny === false && 'starszy plik'].filter(Boolean).join(' · ')}</small>
    {plik.downloadUrl && czyBezpiecznyAdres(plik.downloadUrl) ? <a className="text-link" href={plik.downloadUrl} target="_blank" rel="noreferrer">Pobierz</a> : <em>Plik nie został jeszcze dodany.</em>}
  </article>)}</div>;
}

export function ZbudujSam({ szczegoly, projectSlug, uzytkownik, uprawnienia }: {
  szczegoly: SzczegolyProjektu;
  projectSlug: string;
  uzytkownik: Uzytkownik | null;
  uprawnienia: UprawnieniaUzytkownika;
}) {
  const instrukcja = szczegoly.instrukcja;
  if (!instrukcja) return null;
  return <div className="instrukcja-projektu">
    {(instrukcja.czas || instrukcja.trudnosc) && <p>{[instrukcja.czas && `Czas: ${instrukcja.czas}`, instrukcja.trudnosc && `Trudność: ${instrukcja.trudnosc}`].filter(Boolean).join(' · ')}</p>}
    {instrukcja.wymagania?.length ? <div className="wymagania-instrukcji"><h3>Wymagania</h3><ul>{instrukcja.wymagania.map(wymaganie => <li key={wymaganie}>{wymaganie}</li>)}</ul></div> : null}
    {instrukcja.kroki.map((krok, indeks) => <article id={`krok-${projectSlug}-${krok.id}`} key={krok.id}>
      <b>{indeks + 1}. {krok.tytul}</b>
      <p>{krok.tresc}</p>
      <MediaProjektu media={krok.media} klasa="media-kroku-instrukcji"/>
      <div className="komentarze-kroku">
        <h4>Komentarze do kroku</h4>
        <KomentarzeProjektu key={`${projectSlug}:step:${krok.id}`} projectSlug={projectSlug} context="step" stepId={krok.id} uzytkownik={uzytkownik} uprawnienia={uprawnienia}/>
      </div>
    </article>)}
  </div>;
}

export function DokumentacjaProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  const dane = szczegoly.dokumentacja;
  if (!dane?.length) return null;
  return <div className="dokumentacja-projektu">
    <nav aria-label="Spis treści dokumentacji">{dane.map(sekcja => <a href={`#dokumentacja-${sekcja.id}`} key={sekcja.id}>{sekcja.tytul}</a>)}</nav>
    {dane.map(sekcja => <article id={`dokumentacja-${sekcja.id}`} key={sekcja.id}><h3>{sekcja.tytul}</h3><p>{sekcja.tresc}</p></article>)}
  </div>;
}

function ElementProjektu({ element }: { element:ElementListy }) {
  const zamienniki = [
    element.tanszyZamiennik && { etykieta:'Tańszy zamiennik', nazwa:element.tanszyZamiennik },
    element.drozszyZamiennik && { etykieta:'Droższy zamiennik', nazwa:element.drozszyZamiennik },
  ].filter(Boolean) as Array<{ etykieta:string; nazwa:string }>;

  return <li className="element-projektu">
    <div><b>{element.nazwa}</b>{element.opcjonalny && <span>Opcjonalny</span>}{element.url && czyBezpiecznyAdres(element.url) && <a className="text-link" href={element.url} target="_blank" rel="noreferrer">Zobacz</a>}</div>
    {zamienniki.length > 0 && <ul className="zamienniki-elementu">{zamienniki.map(zamiennik => <li key={zamiennik.etykieta}><small>{zamiennik.etykieta}</small><span>{zamiennik.nazwa}</span></li>)}</ul>}
  </li>;
}

export function CzesciIKoszty({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  return <div className="czesci-koszty">
    {szczegoly.czesci?.length ? <article><h3>Części</h3><ul>{szczegoly.czesci.map(element => <ElementProjektu key={element.nazwa} element={element}/>)}</ul></article> : null}
    {szczegoly.narzedzia?.length ? <article><h3>Narzędzia</h3><ul>{szczegoly.narzedzia.map(element => <ElementProjektu key={element.nazwa} element={element}/>)}</ul></article> : null}
    {szczegoly.koszty && <article><h3>Kosztorys</h3>{szczegoly.koszty.plan !== undefined && <p>Plan: {szczegoly.koszty.plan} {szczegoly.koszty.waluta ?? 'zł'}</p>}{szczegoly.koszty.faktycznie !== undefined && <p>Faktycznie: {szczegoly.koszty.faktycznie} {szczegoly.koszty.waluta ?? 'zł'}</p>}</article>}
  </div>;
}
