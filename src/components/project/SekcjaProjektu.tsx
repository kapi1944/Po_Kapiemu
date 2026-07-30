import type { ReactNode } from 'react';

type WlasciwosciSekcjiProjektu = { id:string; tytul:string; wyrozniona?:boolean; children:ReactNode };
export function SekcjaProjektu({ id, tytul, wyrozniona = false, children: dzieci }: WlasciwosciSekcjiProjektu) {
  return <section id={id} className={`sekcja-projektu ${wyrozniona ? 'sekcja-projektu--wyrozniona' : ''}`} aria-labelledby={`${id}-tytul`}>
    <div className="sekcja-projektu__naglowek"><h2 id={`${id}-tytul`}>{tytul}</h2></div>{dzieci}
  </section>;
}