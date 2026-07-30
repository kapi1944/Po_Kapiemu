import type { SzczegolyProjektu } from '../../data/projectDetails';
import { czyBezpiecznyAdres } from './logikaMediow';

export function RepozytoriumProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  const repozytorium = szczegoly.repozytorium;
  if (!repozytorium) return null;
  return <article className="repozytorium-projektu">
    <div><b>{repozytorium.nazwa}</b>{szczegoly.openSource && <span>Open Source</span>}</div>
    <small>{repozytorium.provider}</small>
    {repozytorium.opis && <p>{repozytorium.opis}</p>}
    {czyBezpiecznyAdres(repozytorium.url) && <a className="text-link" href={repozytorium.url} target="_blank" rel="noreferrer">Otwórz repozytorium</a>}
  </article>;
}

export function OpisDodatkowy({ tresc }: { tresc?:string }) {
  return tresc ? <p className="opis-dodatkowy-projektu">{tresc}</p> : null;
}

export function ListaDodatkowa({ elementy }: { elementy?:string[] }) {
  return elementy?.length ? <ul className="lista-dodatkowa-projektu">{elementy.map(element => <li key={element}>{element}</li>)}</ul> : null;
}

export function FaqProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  if (!szczegoly.faq?.length) return null;
  return <div className="faq-projektu">{szczegoly.faq.map(element => <details key={element.pytanie}><summary>{element.pytanie}</summary><p>{element.odpowiedz}</p></details>)}</div>;
}

export function NieudaneEksperymentyProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  if (!szczegoly.nieudaneEksperymenty?.length) return null;
  const dokumentacja = new Set((szczegoly.dokumentacja ?? []).map(element => element.id));
  return <div className="eksperymenty-projektu">{szczegoly.nieudaneEksperymenty.map(element => <article key={element.id}>
    <time dateTime={element.data}>{element.data}</time>
    <h3>{element.tytul}</h3>
    <p>{element.opis}</p>
    {element.rozwiazanieId && dokumentacja.has(element.rozwiazanieId) && <a className="text-link" href={`#dokumentacja-${element.rozwiazanieId}`}>Przejdź do rozwiązania</a>}
  </article>)}</div>;
}
