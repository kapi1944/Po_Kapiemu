import type { ReactNode } from 'react';
import type { SzczegolyProjektu } from '../../data/projectDetails';
import type { Project } from '../../data/siteData';
import { Icon } from '../Icons';
import { SekcjaProjektu } from './SekcjaProjektu';

export type DostepnaSekcja = { id:string; etykieta:string; zawartosc:ReactNode };
export function pobierzDostepneSekcje(projekt: Project, szczegoly?: SzczegolyProjektu): DostepnaSekcja[] {
  if (!szczegoly) return [];
  const sekcje: Record<string, DostepnaSekcja | undefined> = {
    najwazniejsze: projekt.highlights.length ? { id:'najwazniejsze', etykieta:'Najważniejsze', zawartosc:<ul className="feature-list">{projekt.highlights.map(element => <li key={element}><Icon name="spark" size={15}/>{element}</li>)}</ul> } : undefined,
    aktualizacje: szczegoly.aktualizacje?.length ? { id:'aktualizacje', etykieta:'Aktualizacje', zawartosc:<div className="projektowa-lista-aktualizacji">{szczegoly.aktualizacje.map(aktualizacja => <article key={aktualizacja.id}><time dateTime={aktualizacja.data}>{new Intl.DateTimeFormat('pl-PL', { dateStyle:'long' }).format(new Date(aktualizacja.data))}</time>{aktualizacja.tytul && <h3>{aktualizacja.tytul}</h3>}<p>{aktualizacja.tresc}</p>{aktualizacja.zmiana && <small>Zmiana: {aktualizacja.zmiana}</small>}</article>)}</div> } : undefined,
  };
  return (szczegoly.kolejnoscSekcji ?? Object.keys(sekcje)).map(id => sekcje[id]).filter((sekcja): sekcja is DostepnaSekcja => Boolean(sekcja));
}
export function RenderowaneSekcjeProjektu({ sekcje, wyroznione }: { sekcje:DostepnaSekcja[]; wyroznione?:string[] }) {
  return <>{sekcje.map(sekcja => <SekcjaProjektu key={sekcja.id} id={sekcja.id} tytul={sekcja.etykieta} wyrozniona={wyroznione?.includes(sekcja.id)}>{sekcja.zawartosc}</SekcjaProjektu>)}</>;
}