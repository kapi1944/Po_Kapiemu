import type { ProjectStatus } from './siteData';

export type RolaWidza = 'guest' | 'registered' | 'supporter' | 'author';
export type StatusDojrzalosci = 'Koncepcja' | 'Wczesny prototyp' | 'Prototyp działający' | 'Wersja testowa' | 'Wersja użytkowa' | 'Wersja stabilna' | 'Wersja finalna';
export type WidocznoscEtapu = 'registered' | 'supporter';
export type KamienMilowy = { id:string; tytul:string; status:ProjectStatus; opis?:string; data?:string; orientacyjny?:boolean };
export type EtapPrzyszly = { id:string; tytul:string; opis?:string; dostep:WidocznoscEtapu; termin?:string };
export type AktualizacjaProjektu = { id:string; data:string; tytul?:string; tresc:string; zmiana?:string; media?: string[]; zalaczniki?:string[]; kamienMilowyId?:string };
export type MediumGalerii = { id:string; typ:'image'|'video'; url:string; opis?:string };
export type PunktGalerii = { id:string; data:string; tytul:string; miniatura:string; media:MediumGalerii[] };
export type OpcjaGlosowania = { id:string; etykieta:string; glosy:number; obraz?:string };
export type GlosowanieProjektu = { id:string; pytanie:string; opis?:string; aktywne:boolean; opcje:OpcjaGlosowania[]; decyzjaAutora?:string };
export type PlikProjektu = { id:string; kategoria:'Dokumentacja'|'Schematy'|'Kod'|'Modele'|'Grafiki'|'Inne'; nazwa:string; opis?:string; rozmiar?:string; wersja?:string; zgodnyZ?:string; downloadUrl?:string; aktualny?:boolean };
export type KrokInstrukcji = { id:string; tytul:string; tresc:string; media?:MediumGalerii[] };
export type ElementListy = { nazwa:string; opcjonalny?:boolean; tanszyZamiennik?:string; drozszyZamiennik?:string; url?:string };
export type SekcjaDokumentacji = { id:string; tytul:string; tresc:string };
export type WersjaProjektu = { nazwa:string; data:string; dojrzalosc:StatusDojrzalosci; zmiany:string[]; changelogUrl?:string };
export type RelacjaProjektu = { typ:'oryginalny'|'rozwinięcie'|'modyfikacja'|'alternatywna wersja'|'autorski'; projektZrodlowySlug?:string };
export type SzczegolyProjektu = {
  slug:string; rozpoczecie:string; aktualizacja:string; dojrzalosc:StatusDojrzalosci; aktualnyEtap:string;
  kamienieGlowne:KamienMilowy[]; kamieniePosrednie?:KamienMilowy[]; przyszleEtapy?:EtapPrzyszly[]; obserwujacy:number;
  aktualizacje?:AktualizacjaProjektu[]; galeria?:PunktGalerii[]; glosowania?:GlosowanieProjektu[]; instrukcja?:{ czas?:string; trudnosc?:string; wymagania?:string[]; kroki:KrokInstrukcji[] };
  czesci?:ElementListy[]; narzedzia?:ElementListy[]; koszty?:{ plan?:number; faktycznie?:number; waluta?:string }; dokumentacja?:SekcjaDokumentacji[];
  pliki?:PlikProjektu[]; repozytorium?:{ nazwa:string; provider:string; url:string; opis:string }; wersje?:WersjaProjektu[]; nieudaneEksperymenty?:{ id:string; data:string; tytul:string; opis:string; rozwiazanieId?:string }[];
  faq?:{ pytanie:string; odpowiedz:string }[]; ograniczenia?:string[]; dlaKogo?:string; dlaKogoNie?:string; lekcje?:string[]; decyzje?:string[];
  relacja?:RelacjaProjektu; openSource?:boolean; kolejnoscSekcji?:string[]; wyroznioneSekcje?:string[];
};

export const szczegolyProjektow: Record<string, SzczegolyProjektu> = {
  'po-kapiemu': {
    slug:'po-kapiemu', rozpoczecie:'2026-06-04', aktualizacja:'2026-07-30', dojrzalosc:'Wczesny prototyp', aktualnyEtap:'Układanie podstron projektów', obserwujacy:128,
    kamienieGlowne:[
      { id:'pomysl', tytul:'Pomysł', status:'Pomysł', data:'2026-05-01' }, { id:'planowanie', tytul:'Planowanie', status:'Planowanie', data:'2026-05-18' },
      { id:'realizacja', tytul:'W realizacji', status:'W realizacji', data:'2026-06-04' }, { id:'testowanie', tytul:'Testowanie', status:'Testowanie', orientacyjny:true }, { id:'ukonczony', tytul:'Ukończony', status:'Ukończony', orientacyjny:true },
    ],
    kamieniePosrednie:[{ id:'pierwszy-prototyp', tytul:'Pierwszy prototyp', status:'W realizacji', data:'2026-06-16' }],
    przyszleEtapy:[{ id:'testy-spoleczne', tytul:'Testy społeczności', dostep:'registered', termin:'orientacyjnie sierpień' },{ id:'materialy', tytul:'Materiały dla społeczności', dostep:'supporter', termin:'orientacyjnie wrzesień' }],
    aktualizacje:[{ id:'u1', data:'2026-07-30', tytul:'Karty projektów', tresc:'Powstał modułowy fundament pod szczegółowe historie projektów.', zmiana:'Dodano strukturę sekcji i nawigację.' },{ id:'u2', data:'2026-07-12', tresc:'Doprecyzowano kierunek portalu i rolę głosowań społeczności.' }],
    kolejnoscSekcji:['najwazniejsze','aktualizacje'], wyroznioneSekcje:['najwazniejsze'],
  },
  'asystent-bur': { slug:'asystent-bur', rozpoczecie:'2026-03-12', aktualizacja:'2026-07-29', dojrzalosc:'Wersja testowa', aktualnyEtap:'Testy importu harmonogramów', obserwujacy:46, kamienieGlowne:[{ id:'pomysl', tytul:'Pomysł', status:'Pomysł' },{ id:'realizacja', tytul:'W realizacji', status:'W realizacji' },{ id:'testowanie', tytul:'Testowanie', status:'Testowanie' }], kolejnoscSekcji:['najwazniejsze'] },
};