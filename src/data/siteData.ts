export type ProjectStatus = 'Pomysł' | 'Planowanie' | 'W trakcie' | 'Testy' | 'Aktywny' | 'Wstrzymany' | 'Zakończony';
export type ProjectCategory = 'technical' | 'music' | 'blocks' | 'experimental';
export type TypMaterialuRecenzenckiego = 'review' | 'test' | 'comparison';

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  category: ProjectCategory;
  active: boolean;
  locked?: boolean;
  saved?: boolean;
  updatesCount?: number;
  commentsCount?: number;
  lastUpdated?: string;
  image?: string;
  highlights: string[];
};

export const nazwyKategorii: Record<ProjectCategory, string> = {
  technical: 'Techniczne',
  music: 'Muzyczne',
  blocks: 'Klockowe',
  experimental: 'Eksperymentalne',
};

export const projects: Project[] = [
  { slug:'videdit-studio', title:'VidEdit Studio', eyebrow:'Narzędzie · montaż wideo', description:'Lekki, webowy edytor do automatyzacji powtarzalnych czynności w montażu: napisy, cisza, audio i szybki workflow.', status:'W trakcie', progress:68, category:'technical', active:true, saved:true, updatesCount:18, commentsCount:7, lastUpdated:'Dzisiaj', image:'/projekty/videdit-studio.svg', highlights:['Timeline i podgląd wideo','Tryb PRO / LITE','Automatyzacja FFmpeg'] },
  { slug:'asystent-bur', title:'Asystent BUR', eyebrow:'Automatyzacja · Chrome', description:'Rozszerzenie upraszczające przenoszenie danych ze stron szkoleń do formularzy BUR i przygotowanie harmonogramów.', status:'Testy', progress:82, category:'technical', active:true, updatesCount:11, commentsCount:4, lastUpdated:'Wczoraj', image:'/projekty/asystent-bur.svg', highlights:['Import danych SEMPER','Generator harmonogramu','Walidacja i podgląd zmian'] },
  { slug:'po-kapiemu', title:'Po Kapiemu', eyebrow:'Portal · społeczność', description:'To właśnie ta strona: centrum projektów, głosowań, materiałów, recenzji i wspólnego decydowania o kolejnych pomysłach.', status:'Aktywny', progress:31, category:'experimental', active:true, updatesCount:9, commentsCount:12, lastUpdated:'2 dni temu', image:'/projekty/po-kapiemu.svg', highlights:['Projekty w jednym miejscu','Głosowania społeczności','Treści i recenzje'] },
  { slug:'projekt-lab', title:'Projekt LAB', eyebrow:'Tylko dla zalogowanych', description:'Eksperymentalny projekt rozwijany po cichu. Szczegóły pojawią się najpierw dla zalogowanej społeczności.', status:'Pomysł', progress:12, category:'experimental', active:false, locked:true, updatesCount:3, commentsCount:0, lastUpdated:'Tydzień temu', image:'/projekty/projekt-lab.svg', highlights:['Wczesny dostęp','Eksperymenty','Materiały zza kulis'] },
  { slug:'echo', title:'ECHO', eyebrow:'Dom · automatyzacja', description:'Inteligentny asystent i system automatyzacji domu rozwijany jako własny projekt Po Kapiemu.', status:'W trakcie', progress:44, category:'technical', active:true, updatesCount:6, commentsCount:2, lastUpdated:'Dzisiaj', image:'/projekty/echo.svg', highlights:['Scenariusze Home Assistant','Sterowanie głosowe','Integracje urządzeń i czujników'] },
];

export const contentItems = [
  { type:'Film', title:'Jak powstaje VidEdit Studio?', meta:'12 min · kulisy projektu', tag:'Wideo' },
  { type:'Aktualizacja', title:'Asystent BUR: nowy import harmonogramów', meta:'Dzisiaj · 4 min czytania', tag:'Projekt' },
  { type:'Artykuł', title:'Po co mi własne narzędzia?', meta:'6 min czytania', tag:'Po Kapiemu' },
  { type:'Materiał', title:'Lista adapterów USB-C → jack do testów', meta:'Do pobrania · PDF', tag:'Audio' },
];

export const aktywnosci = [
  { ikona:'projects', kolor:'technical', przed:'', wyroznienie:'Asystent BUR', po:' otrzymał nowy import harmonogramów.', czas:'12 min temu' },
  { ikona:'vote', kolor:'music', przed:'Wystartowało głosowanie o kolejny materiał.', czas:'38 min temu' },
  { ikona:'reviews', kolor:'blocks', przed:'Nowa recenzja: ', wyroznienie:'FiiO KA11', po:' jest gotowa.', czas:'Dzisiaj, 09:24' },
] satisfies Array<{ ikona:string; kolor:ProjectCategory; przed:string; wyroznienie?:string; po?:string; czas:string }>;

export const etykietyTypowMaterialowRecenzenckich: Record<TypMaterialuRecenzenckiego, string> = { review:'Recenzja', test:'Test', comparison:'Porównanie' };

export const reviews = [
  { typ:'review', title:'FiiO KA11', category:'Sprzęt audio', score:8.8, verdict:'Mały DAC z dużym zapasem mocy.', author:'Kapi', date:'Dzisiaj' },
  { typ:'test', title:'SNOWSKY TINY A', category:'Gadżety', score:8.1, verdict:'Ciekawy kompromis między mobilnością a jakością.', author:'Kapi', date:'Wczoraj' },
  { typ:'comparison', title:'DaVinci Resolve', category:'Programy', score:9.2, verdict:'Potężny kombajn, który ciągle potrafi zaskoczyć.', author:'Kapi', date:'12 lipca' },
] satisfies Array<{ typ:TypMaterialuRecenzenckiego; title:string; category:string; score:number; verdict:string; author:string; date:string }>;

export const poll = {
  question:'Który materiał powinien powstać jako następny?',
  binding:false,
  options:[
    { label:'Porównanie przenośnych DAC-ów USB-C', votes:46, category:'music' },
    { label:'Kulisy budowy VidEdit Studio', votes:34, category:'technical' },
    { label:'Jak automatyzuję pracę z BUR', votes:20, category:'experimental' },
  ] satisfies Array<{ label:string; votes:number; category:ProjectCategory }>,
};
