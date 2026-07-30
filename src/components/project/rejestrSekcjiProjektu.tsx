import type { ReactNode } from 'react';
import type { SzczegolyProjektu } from '../../data/projectDetails';
import type { Project } from '../../data/siteData';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { Icon } from '../Icons';
import { GaleriaProjektu } from './GaleriaProjektu';
import { GlosowanieProjektu } from './GlosowanieProjektu';
import { KomentarzeProjektu } from './KomentarzeProjektu';
import { CzesciIKoszty, DokumentacjaProjektu, MaterialyProjektu, ZbudujSam } from './ZasobyProjektu';
import { ProjektySpolecznosci, WersjeProjektu } from './WersjeSpolecznosc';

export type DostepnaSekcja = {
  id: string;
  etykieta: string;
  warunekWidocznosci: boolean;
  zawartosc: ReactNode;
};

type ZaleznosciSekcji = {
  projekt: Project;
  szczegoly?: SzczegolyProjektu;
  projectSlug: string;
  uzytkownik: Uzytkownik | null;
  uprawnienia: UprawnieniaUzytkownika;
};

export function pobierzDostepneSekcje({ projekt, szczegoly, projectSlug, uzytkownik, uprawnienia }: ZaleznosciSekcji): DostepnaSekcja[] {
  if (!szczegoly) return [];
  const rola = uprawnienia.widocznoscProjektu;
  const sekcje: Record<string, DostepnaSekcja | undefined> = {
    najwazniejsze: {
      id:'najwazniejsze',
      etykieta:'Najważniejsze',
      warunekWidocznosci:projekt.highlights.length > 0,
      zawartosc:<ul className="feature-list">{projekt.highlights.map(element => <li key={element}><Icon name="spark" size={15}/>{element}</li>)}</ul>,
    },
    aktualizacje: {
      id:'aktualizacje',
      etykieta:'Aktualizacje',
      warunekWidocznosci:Boolean(szczegoly.aktualizacje?.length),
      zawartosc:<div className="projektowa-lista-aktualizacji">{szczegoly.aktualizacje?.map(element => <article key={element.id}><time>{element.data}</time>{element.tytul && <h3>{element.tytul}</h3>}<p>{element.tresc}</p></article>)}</div>,
    },
    galeria: {
      id:'galeria',
      etykieta:'Galeria etapów',
      warunekWidocznosci:Boolean(szczegoly.galeria?.length),
      zawartosc:<GaleriaProjektu punkty={szczegoly.galeria ?? []}/>,
    },
    glosowania: {
      id:'glosowania',
      etykieta:'Głosowania',
      warunekWidocznosci:Boolean(szczegoly.glosowania?.length),
      zawartosc:<GlosowanieProjektu projectSlug={projectSlug} glosowania={szczegoly.glosowania ?? []} uzytkownik={uzytkownik} uprawnienia={uprawnienia}/>,
    },
    komentarze: {
      id:'komentarze',
      etykieta:'Komentarze',
      warunekWidocznosci:true,
      zawartosc:<KomentarzeProjektu key={`${projectSlug}:project`} projectSlug={projectSlug} context="project" uzytkownik={uzytkownik} uprawnienia={uprawnienia}/>,
    },
    materialy: {
      id:'materialy',
      etykieta:'Materiały',
      warunekWidocznosci:Boolean(szczegoly.pliki?.length),
      zawartosc:<MaterialyProjektu szczegoly={szczegoly} rola={rola}/>,
    },
    'zbuduj-sam': {
      id:'zbuduj-sam',
      etykieta:'Zbuduj sam',
      warunekWidocznosci:Boolean(szczegoly.instrukcja),
      zawartosc:<ZbudujSam szczegoly={szczegoly}/>,
    },
    'czesci-i-koszty': {
      id:'czesci-i-koszty',
      etykieta:'Części i koszty',
      warunekWidocznosci:Boolean(szczegoly.czesci?.length || szczegoly.narzedzia?.length || szczegoly.koszty),
      zawartosc:<CzesciIKoszty szczegoly={szczegoly}/>,
    },
    wersje: {
      id:'wersje',
      etykieta:'Wersje',
      warunekWidocznosci:Boolean(szczegoly.wersje?.length),
      zawartosc:<WersjeProjektu szczegoly={szczegoly}/>,
    },
    spolecznosc: {
      id:'spolecznosc',
      etykieta:'Społeczność',
      warunekWidocznosci:true,
      zawartosc:<ProjektySpolecznosci szczegoly={szczegoly}/>,
    },
    dokumentacja: {
      id:'dokumentacja',
      etykieta:'Dokumentacja',
      warunekWidocznosci:Boolean(szczegoly.dokumentacja?.length),
      zawartosc:<DokumentacjaProjektu szczegoly={szczegoly}/>,
    },
  };

  const kolejnosc = szczegoly.kolejnoscSekcji ?? Object.keys(sekcje);
  return [...kolejnosc, ...Object.keys(sekcje)]
    .filter((id, indeks, lista) => lista.indexOf(id) === indeks)
    .map(id => sekcje[id])
    .filter((sekcja): sekcja is DostepnaSekcja => Boolean(sekcja?.warunekWidocznosci));
}
