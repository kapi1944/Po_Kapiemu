export type ProjectStatus = 'Pomysł' | 'Planowanie' | 'W trakcie' | 'Testy' | 'Aktywny' | 'Wstrzymany' | 'Zakończony';
export type Project = { slug:string; title:string; eyebrow:string; description:string; status:ProjectStatus; progress:number; category:'video'|'tools'|'community'|'secret'; accent:string; active:boolean; locked?:boolean; highlights:string[] };
export const projects: Project[] = [
{slug:'videdit-studio',title:'VidEdit Studio',eyebrow:'Narzędzie • montaż wideo',description:'Lekki, webowy edytor do automatyzacji powtarzalnych czynności w montażu: napisy, cisza, audio i szybki workflow.',status:'W trakcie',progress:68,category:'video',accent:'violet',active:true,highlights:['Timeline i podgląd wideo','Tryb PRO / LITE','Automatyzacja FFmpeg']},
{slug:'asystent-bur',title:'Asystent BUR',eyebrow:'Automatyzacja • Chrome',description:'Rozszerzenie upraszczające przenoszenie danych ze stron szkoleń do formularzy BUR i przygotowanie harmonogramów.',status:'Testy',progress:82,category:'tools',accent:'cyan',active:true,highlights:['Import danych SEMPER','Generator harmonogramu','Walidacja i podgląd zmian']},
{slug:'po-kapiemu',title:'Po Kapiemu',eyebrow:'Społeczność • portal',description:'To właśnie ta strona: centrum projektów, głosowań, materiałów, recenzji i wspólnego decydowania o kolejnych pomysłach.',status:'Aktywny',progress:31,category:'community',accent:'amber',active:true,highlights:['Projekty w jednym miejscu','Głosowania społeczności','Treści i recenzje']},
{slug:'projekt-lab',title:'Projekt LAB',eyebrow:'Tylko dla zalogowanych',description:'Eksperymentalny projekt rozwijany po cichu. Szczegóły pojawią się najpierw dla zalogowanej społeczności.',status:'Pomysł',progress:12,category:'secret',accent:'rose',active:false,locked:true,highlights:['Wczesny dostęp','Eksperymenty','Materiały zza kulis']}
];
export const contentItems=[
{type:'Film',title:'Jak powstaje VidEdit Studio?',meta:'12 min • kulisy projektu',tag:'Wideo'},
{type:'Aktualizacja',title:'Asystent BUR: nowy import harmonogramów',meta:'Dzisiaj • 4 min czytania',tag:'Projekt'},
{type:'Artykuł',title:'Po co mi własne narzędzia?',meta:'6 min czytania',tag:'Po Kapiemu'},
{type:'Materiał',title:'Lista adapterów USB-C → jack do testów',meta:'Do pobrania • PDF',tag:'Audio'}
];
export const reviews=[
{title:'FiiO KA11',category:'Sprzęt audio',score:8.8,verdict:'Mały DAC z dużym zapasem mocy.'},
{title:'SNOWSKY TINY A',category:'Gadżety',score:8.1,verdict:'Ciekawy kompromis między mobilnością a jakością.'},
{title:'DaVinci Resolve',category:'Programy',score:9.2,verdict:'Potężny kombajn, który ciągle potrafi zaskoczyć.'}
];
export const poll={question:'Który materiał powinien powstać jako następny?',binding:false,options:[{label:'Porównanie przenośnych DAC-ów USB-C',votes:46},{label:'Kulisy budowy VidEdit Studio',votes:34},{label:'Jak automatyzuję pracę z BUR',votes:20}]};
