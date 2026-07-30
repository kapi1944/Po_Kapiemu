import type { ReactNode } from 'react';
import type { SzczegolyProjektu, RolaWidza } from '../../data/projectDetails';
import type { Project } from '../../data/siteData';
import { Icon } from '../Icons';
import { GaleriaProjektu } from './GaleriaProjektu';
import { GlosowanieProjektu } from './GlosowanieProjektu';
import { KomentarzeProjektu } from './KomentarzeProjektu';
import { CzesciIKoszty, DokumentacjaProjektu, MaterialyProjektu, ZbudujSam } from './ZasobyProjektu';
import { ProjektySpolecznosci, WersjeProjektu } from './WersjeSpolecznosc';
export type DostepnaSekcja = { id:string; etykieta:string; zawartosc:ReactNode };
export function pobierzDostepneSekcje(projekt:Project, szczegoly?:SzczegolyProjektu, rola:RolaWidza='guest'):DostepnaSekcja[] { if (!szczegoly) return []; const sekcje:Record<string,DostepnaSekcja|undefined> = {
 najwazniejsze:projekt.highlights.length?{id:'najwazniejsze',etykieta:'Najważniejsze',zawartosc:<ul className="feature-list">{projekt.highlights.map(element=><li key={element}><Icon name="spark" size={15}/>{element}</li>)}</ul>}:undefined,
 aktualizacje:szczegoly.aktualizacje?.length?{id:'aktualizacje',etykieta:'Aktualizacje',zawartosc:<div className="projektowa-lista-aktualizacji">{szczegoly.aktualizacje.map(element=><article key={element.id}><time>{element.data}</time>{element.tytul&&<h3>{element.tytul}</h3>}<p>{element.tresc}</p></article>)}</div>}:undefined,
 galeria:szczegoly.galeria?.length?{id:'galeria',etykieta:'Galeria etapów',zawartosc:<GaleriaProjektu punkty={szczegoly.galeria}/>} :undefined,
 glosowania:szczegoly.glosowania?.length?{id:'glosowania',etykieta:'Głosowania',zawartosc:<GlosowanieProjektu glosowania={szczegoly.glosowania} rola={rola}/>} :undefined,
 komentarze:{id:'komentarze',etykieta:'Komentarze',zawartosc:<KomentarzeProjektu rola={rola}/>},
 materialy:szczegoly.pliki?.length?{id:'materialy',etykieta:'Materiały',zawartosc:<MaterialyProjektu szczegoly={szczegoly} rola={rola}/>} :undefined,
 'zbuduj-sam':szczegoly.instrukcja?{id:'zbuduj-sam',etykieta:'Zbuduj sam',zawartosc:<ZbudujSam szczegoly={szczegoly}/>} :undefined,
 'czesci-i-koszty':(szczegoly.czesci?.length||szczegoly.narzedzia?.length||szczegoly.koszty)?{id:'czesci-i-koszty',etykieta:'Części i koszty',zawartosc:<CzesciIKoszty szczegoly={szczegoly}/>} :undefined,
 wersje:szczegoly.wersje?.length?{id:'wersje',etykieta:'Wersje',zawartosc:<WersjeProjektu szczegoly={szczegoly}/>} :undefined,
 spolecznosc:{id:'spolecznosc',etykieta:'Społeczność',zawartosc:<ProjektySpolecznosci szczegoly={szczegoly}/>},
 dokumentacja:szczegoly.dokumentacja?.length?{id:'dokumentacja',etykieta:'Dokumentacja',zawartosc:<DokumentacjaProjektu szczegoly={szczegoly}/>} :undefined,
 }; return (szczegoly.kolejnoscSekcji??Object.keys(sekcje)).map(id=>sekcje[id]).filter((sekcja):sekcja is DostepnaSekcja=>Boolean(sekcja)); }
