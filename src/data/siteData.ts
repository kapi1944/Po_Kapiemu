export type ProjectStatus = 'Pomysł' | 'Planowanie' | 'W trakcie' | 'Testy' | 'Aktywny' | 'Wstrzymany' | 'Zakończony';
export type ProjectCategory = 'technical' | 'music' | 'blocks' | 'experimental';

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
];

export const contentItems = [
  { type:'Film', title:'Jak powstaje VidEdit Studio?', meta:'12 min · kulisy projektu', tag:'Wideo' },
  { type:'Aktualizacja', title:'Asystent BUR: nowy import harmonogramów', meta:'Dzisiaj · 4 min czytania', tag:'Projekt' },
  { type:'Artykuł', title:'Po co mi własne narzędzia?', meta:'6 min czytania', tag:'Po Kapiemu' },
  { type:'Materiał', title:'Lista adapterów USB-C → jack do testów', meta:'Do pobrania · PDF', tag:'Audio' },
];

export const reviews = [
  { title:'FiiO KA11', category:'Recenzja · sprzęt audio', score:8.8, verdict:'Mały DAC z dużym zapasem mocy.', author:'Kapi', date:'Dzisiaj' },
  { title:'SNOWSKY TINY A', category:'Test · gadżety', score:8.1, verdict:'Ciekawy kompromis między mobilnością a jakością.', author:'Kapi', date:'Wczoraj' },
  { title:'DaVinci Resolve', category:'Porównanie · programy', score:9.2, verdict:'Potężny kombajn, który ciągle potrafi zaskoczyć.', author:'Kapi', date:'12 lipca' },
];

export const poll = {
  question:'Który materiał powinien powstać jako następny?',
  binding:false,
  options:[
    { label:'Porównanie przenośnych DAC-ów USB-C', votes:46, category:'music' },
    { label:'Kulisy budowy VidEdit Studio', votes:34, category:'technical' },
    { label:'Jak automatyzuję pracę z BUR', votes:20, category:'experimental' },
  ] satisfies Array<{ label:string; votes:number; category:ProjectCategory }>,
};
