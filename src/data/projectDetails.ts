import type { ProjectStatus } from './siteData';

export type RolaWidza = 'guest' | 'registered' | 'supporter' | 'author';
export type StatusDojrzalosci = 'Koncepcja' | 'Wczesny prototyp' | 'Prototyp działający' | 'Wersja testowa' | 'Wersja użytkowa' | 'Wersja stabilna' | 'Wersja finalna';
export type WidocznoscEtapu = 'registered' | 'supporter';
export type KamienMilowy = { id:string; tytul:string; status:ProjectStatus; opis?:string; data?:string; orientacyjny?:boolean; glownyKamienId?:string };
export type EtapPrzyszly = { id:string; tytul:string; opis?:string; dostep:WidocznoscEtapu; termin?:string };
export type AktualizacjaProjektu = { id:string; data:string; tytul?:string; tresc:string; zmiana?:string; media?: string[]; zalaczniki?:string[]; kamienMilowyId?:string };
export type MediumGalerii = { id:string; typ:'image'|'video'; url:string; opis?:string };
export type PunktGalerii = { id:string; data:string; tytul:string; miniatura?:string; media?:MediumGalerii[] };
export type OpcjaGlosowania = { id:string; etykieta:string; glosy:number; obraz?:string };
export type GlosowanieProjektu = { id:string; pytanie:string; opis?:string; aktywne:boolean; opcje:OpcjaGlosowania[]; decyzjaAutora?:string };
export type PlikProjektu = { id:string; kategoria:'Dokumentacja'|'Schematy'|'Kod'|'Modele'|'Grafiki'|'Inne'; nazwa:string; opis?:string; rozmiar?:string; wersja?:string; zgodnyZ?:string; downloadUrl?:string; aktualny?:boolean };
export type KrokInstrukcji = { id:string; tytul:string; tresc:string; media?:MediumGalerii[] };
export type ElementListy = { nazwa:string; opcjonalny?:boolean; tanszyZamiennik?:string; drozszyZamiennik?:string; url?:string };
export type SekcjaDokumentacji = { id:string; tytul:string; tresc:string };
export type WersjaProjektu = { nazwa:string; data:string; dojrzalosc:StatusDojrzalosci; zmiany:string[]; changelogUrl?:string };
export type RelacjaProjektu = { typ:'oryginalny'|'rozwinięcie'|'modyfikacja'|'alternatywna wersja'|'autorski'; projektZrodlowySlug?:string };
export type SzczegolyProjektu = {
  slug:string; rozpoczecie:string; aktualizacja:string; dojrzalosc:StatusDojrzalosci; aktualnyEtap:string; aktualnyKamienId?:string;
  kamienieGlowne:KamienMilowy[]; kamieniePosrednie?:KamienMilowy[]; przyszleEtapy?:EtapPrzyszly[]; obserwujacy:number;
  aktualizacje?:AktualizacjaProjektu[]; galeria?:PunktGalerii[]; glosowania?:GlosowanieProjektu[]; instrukcja?:{ czas?:string; trudnosc?:string; wymagania?:string[]; kroki:KrokInstrukcji[] };
  czesci?:ElementListy[]; narzedzia?:ElementListy[]; koszty?:{ plan?:number; faktycznie?:number; waluta?:string }; dokumentacja?:SekcjaDokumentacji[];
  pliki?:PlikProjektu[]; repozytorium?:{ nazwa:string; provider:string; url:string; opis:string }; wersje?:WersjaProjektu[]; nieudaneEksperymenty?:{ id:string; data:string; tytul:string; opis:string; rozwiazanieId?:string }[];
  faq?:{ pytanie:string; odpowiedz:string }[]; ograniczenia?:string[]; dlaKogo?:string; dlaKogoNie?:string; lekcje?:string[]; decyzje?:string[];
  relacja?:RelacjaProjektu; openSource?:boolean; kolejnoscSekcji?:string[]; wyroznioneSekcje?:string[];
};

export const szczegolyProjektow: Record<string, SzczegolyProjektu> = {
  'po-kapiemu': {
    slug:'po-kapiemu', rozpoczecie:'2026-06-04', aktualizacja:'2026-07-30', dojrzalosc:'Wczesny prototyp', aktualnyEtap:'Układanie podstron projektów', aktualnyKamienId:'realizacja', obserwujacy:128,
    kamienieGlowne:[
      { id:'pomysl', tytul:'Pomysł', status:'Pomysł', data:'2026-05-01' }, { id:'planowanie', tytul:'Planowanie', status:'Planowanie', data:'2026-05-18' },
      { id:'realizacja', tytul:'W realizacji', status:'W realizacji', data:'2026-06-04' }, { id:'testowanie', tytul:'Testowanie', status:'Testowanie', orientacyjny:true }, { id:'ukonczony', tytul:'Ukończony', status:'Ukończony', orientacyjny:true },
    ],
    kamieniePosrednie:[{ id:'pierwszy-prototyp', tytul:'Pierwszy prototyp', status:'W realizacji', glownyKamienId:'realizacja', data:'2026-06-16' }],
    przyszleEtapy:[{ id:'testy-spoleczne', tytul:'Testy społeczności', dostep:'registered', termin:'orientacyjnie sierpień' },{ id:'materialy', tytul:'Materiały dla społeczności', dostep:'supporter', termin:'orientacyjnie wrzesień' }],
    aktualizacje:[{ id:'u1', data:'2026-07-30', tytul:'Karty projektów', tresc:'Powstał modułowy fundament pod szczegółowe historie projektów.', zmiana:'Dodano strukturę sekcji i nawigację.' },{ id:'u2', data:'2026-07-12', tresc:'Doprecyzowano kierunek portalu i rolę głosowań społeczności.' }],
    openSource:true, wersje:[{nazwa:'v0.3',data:'2026-07-30',dojrzalosc:'Wczesny prototyp',zmiany:['Modulowe sekcje','Galeria etapow']},{nazwa:'v0.2',data:'2026-07-12',dojrzalosc:'Koncepcja',zmiany:['Pierwszy uklad']}],
    pliki:[{id:'opis',kategoria:'Dokumentacja',nazwa:'Opis zalozen',opis:'Krotki opis kierunku projektu.',rozmiar:'120 KB',wersja:'0.3',zgodnyZ:'v0.3',aktualny:true}], instrukcja:{czas:'20 min',trudnosc:'Podstawowa',kroki:[{id:'otworz',tytul:'Otworz projekt',tresc:'Przejdz do wybranego projektu.'}]}, czesci:[{nazwa:'Przegladarka'}], narzedzia:[{nazwa:'Edytor tekstu'}], koszty:{plan:0,faktycznie:0,waluta:'zł'}, dokumentacja:[{id:'cel',tytul:'Cel',tresc:'Portal zbiera projekty i ich historie.'}],
    glosowania:[{ id:'wyglad-kart', pytanie:'Który kierunek kart projektów rozwijać dalej?', opis:'Wybór pomoże ustawić kolejność następnych prac.', aktywne:true, opcje:[{id:'a',etykieta:'Dzienniki projektów',glosy:34},{id:'b',etykieta:'Materiały do pobrania',glosy:26}] }],
    galeria:[{ id:'start', data:'04.06.2026', tytul:'Start portalu', miniatura:'/projekty/po-kapiemu.svg', media:[{ id:'m1', typ:'image', url:'/projekty/po-kapiemu.svg', opis:'Pierwszy widok projektu.' }] },{ id:'karty', data:'30.07.2026', tytul:'Karty projektow', miniatura:'/projekty/po-kapiemu.svg', media:[{ id:'m2', typ:'image', url:'/projekty/po-kapiemu.svg', opis:'Modulowa prezentacja etapow.' }] }],
    kolejnoscSekcji:['najwazniejsze','aktualizacje','galeria','glosowania','komentarze','materialy','zbuduj-sam','czesci-i-koszty','dokumentacja','wersje','spolecznosc'], wyroznioneSekcje:['najwazniejsze'],
  },
  'asystent-bur': { slug:'asystent-bur', rozpoczecie:'2026-03-12', aktualizacja:'2026-07-29', dojrzalosc:'Wersja testowa', aktualnyEtap:'Testy importu harmonogramów', aktualnyKamienId:'testowanie', obserwujacy:46, kamienieGlowne:[{ id:'pomysl', tytul:'Pomysł', status:'Pomysł' },{ id:'realizacja', tytul:'W realizacji', status:'W realizacji' },{ id:'testowanie', tytul:'Testowanie', status:'Testowanie' }], relacja:{typ:'rozwinięcie',projektZrodlowySlug:'po-kapiemu'}, kolejnoscSekcji:['najwazniejsze'] },
};