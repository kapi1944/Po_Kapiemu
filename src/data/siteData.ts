export type StatusTresci = 'idea' | 'draft' | 'scheduled' | 'ready' | 'published';
export type TypTresci = 'project' | 'update' | 'video' | 'article' | 'review' | 'test' | 'comparison' | 'material';
export type DostepTresci = 'public' | 'registered' | 'supporters';
export type StatusPublikacjiPlatformy = 'scheduled' | 'published';

export type PublikacjaPlatformowa = {
  id: string;
  nazwaPlatformy: string;
  zaplanowanoNa?: string;
  opublikowanoNa?: string;
  status: StatusPublikacjiPlatformy;
};

export type Tresc = {
  id: string;
  slug?: string;
  title: string;
  type: TypTresci;
  status: StatusTresci;
  excerpt?: string;
  updatedAt?: string;
  plannedAt?: string;
  publishedAt?: string;
  access: DostepTresci;
  image?: string;
  tags?: string[];
  projectSlugs?: string[];
  primaryCategory?: ProjectCategory;
  secondaryCategories?: ProjectCategory[];
  publications?: PublikacjaPlatformowa[];
};

export const etykietyStatusowTresci: Record<StatusTresci, string> = {
  idea: 'PomysĹ‚', draft: 'Szkic', scheduled: 'Zaplanowany', ready: 'Gotowy', published: 'Opublikowany',
};

export const etykietyTypowTresci: Record<TypTresci, string> = {
  project: 'Projekt', update: 'Aktualizacja', video: 'Film', article: 'ArtykuĹ‚', review: 'Recenzja', test: 'Test', comparison: 'PorĂłwnanie', material: 'MateriaĹ‚',
};

export type ProjectStatus = '\u0050omys\u0142' | 'Planowanie' | 'Przygotowanie' | 'W realizacji' | 'Testowanie' | 'Dopracowywanie' | '\u0055ko\u0144czony' | 'Wstrzymany' | 'Porzucony' | 'Rozwijany dalej';
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
  { slug:'videdit-studio', title:'VidEdit Studio', eyebrow:'NarzÄ™dzie Â· montaĹĽ wideo', description:'Lekki, webowy edytor do automatyzacji powtarzalnych czynnoĹ›ci w montaĹĽu: napisy, cisza, audio i szybki workflow.', status:'W realizacji', progress:68, category:'technical', active:true, saved:true, updatesCount:18, commentsCount:7, lastUpdated:'Dzisiaj', image:'/projekty/videdit-studio.svg', highlights:['Timeline i podglÄ…d wideo','Tryb PRO / LITE','Automatyzacja FFmpeg'] },
  { slug:'asystent-bur', title:'Asystent BUR', eyebrow:'Automatyzacja Â· Chrome', description:'Rozszerzenie upraszczajÄ…ce przenoszenie danych ze stron szkoleĹ„ do formularzy BUR i przygotowanie harmonogramĂłw.', status:'Testowanie', progress:82, category:'technical', active:true, updatesCount:11, commentsCount:4, lastUpdated:'Wczoraj', image:'/projekty/asystent-bur.svg', highlights:['Import danych SEMPER','Generator harmonogramu','Walidacja i podglÄ…d zmian'] },
  { slug:'po-kapiemu', title:'Po Kapiemu', eyebrow:'Portal Â· spoĹ‚ecznoĹ›Ä‡', description:'To wĹ‚aĹ›nie ta strona: centrum projektĂłw, gĹ‚osowaĹ„, materiaĹ‚Ăłw, recenzji i wspĂłlnego decydowania o kolejnych pomysĹ‚ach.', status:'W realizacji', progress:31, category:'experimental', active:true, updatesCount:9, commentsCount:12, lastUpdated:'2 dni temu', image:'/projekty/po-kapiemu.svg', highlights:['Projekty w jednym miejscu','GĹ‚osowania spoĹ‚ecznoĹ›ci','TreĹ›ci i recenzje'] },
  { slug:'projekt-lab', title:'Projekt LAB', eyebrow:'Tylko dla zalogowanych', description:'Eksperymentalny projekt rozwijany po cichu. SzczegĂłĹ‚y pojawiÄ… siÄ™ najpierw dla zalogowanej spoĹ‚ecznoĹ›ci.', status:'\u0050omys\u0142', progress:12, category:'experimental', active:false, locked:true, updatesCount:3, commentsCount:0, lastUpdated:'TydzieĹ„ temu', image:'/projekty/projekt-lab.svg', highlights:['Wczesny dostÄ™p','Eksperymenty','MateriaĹ‚y zza kulis'] },
  { slug:'echo', title:'ECHO', eyebrow:'Dom Â· automatyzacja', description:'Inteligentny asystent i system automatyzacji domu rozwijany jako wĹ‚asny projekt Po Kapiemu.', status:'W realizacji', progress:44, category:'technical', active:true, updatesCount:6, commentsCount:2, lastUpdated:'Dzisiaj', image:'/projekty/echo.svg', highlights:['Scenariusze Home Assistant','Sterowanie gĹ‚osowe','Integracje urzÄ…dzeĹ„ i czujnikĂłw'] },
];

export const contentItems = [
  { id:'jak-powstaje-videdit-studio', slug:'jak-powstaje-videdit-studio', type:'video', status:'published', access:'public', title:'Jak powstaje VidEdit Studio?', meta:'12 min Â· kulisy projektu', tag:'Wideo' },
  { id:'asystent-bur-nowy-import-harmonogramow', slug:'asystent-bur-nowy-import-harmonogramow', type:'update', status:'published', access:'public', title:'Asystent BUR: nowy import harmonogramĂłw', meta:'Dzisiaj Â· 4 min czytania', tag:'Projekt' },
  { id:'po-co-mi-wlasne-narzedzia', slug:'po-co-mi-wlasne-narzedzia', type:'article', status:'published', access:'public', title:'Po co mi wĹ‚asne narzÄ™dzia?', meta:'6 min czytania', tag:'Po Kapiemu' },
  { id:'lista-adapterow-usb-c-jack', slug:'lista-adapterow-usb-c-jack', type:'material', status:'published', access:'public', title:'Lista adapterĂłw USB-C â†’ jack do testĂłw', meta:'Do pobrania Â· PDF', tag:'Audio' },
] satisfies Array<Tresc & { meta: string; tag: string }>;
export const redakcyjneTresci = [
  { id:'roboczy-test-wyszukiwarki', slug:'roboczy-test-wyszukiwarki', type:'article', status:'draft', access:'public', title:'Roboczy test wyszukiwarki', meta:'Szkic redakcyjny', tag:'Robocze' },
] satisfies Array<Tresc & { meta: string; tag: string }>;

export const aktywnosci = [
  { ikona:'projects', kolor:'technical', przed:'', wyroznienie:'Asystent BUR', po:' otrzymaĹ‚ nowy import harmonogramĂłw.', czas:'12 min temu' },
  { ikona:'vote', kolor:'music', przed:'WystartowaĹ‚o gĹ‚osowanie o kolejny materiaĹ‚.', czas:'38 min temu' },
  { ikona:'reviews', kolor:'blocks', przed:'Nowa recenzja: ', wyroznienie:'FiiO KA11', po:' jest gotowa.', czas:'Dzisiaj, 09:24' },
] satisfies Array<{ ikona:string; kolor:ProjectCategory; przed:string; wyroznienie?:string; po?:string; czas:string }>;

export const etykietyTypowMaterialowRecenzenckich: Record<TypMaterialuRecenzenckiego, string> = { review:'Recenzja', test:'Test', comparison:'PorĂłwnanie' };

export const reviews = [
  { slug:'fiio-ka11', status:'published', typ:'review', title:'FiiO KA11', category:'SprzÄ™t audio', score:8.8, verdict:'MaĹ‚y DAC z duĹĽym zapasem mocy.', author:'Kapi', date:'Dzisiaj' },
  { slug:'snowsky-tiny-a', status:'published', typ:'test', title:'SNOWSKY TINY A', category:'GadĹĽety', score:8.1, verdict:'Ciekawy kompromis miÄ™dzy mobilnoĹ›ciÄ… a jakoĹ›ciÄ….', author:'Kapi', date:'Wczoraj' },
  { slug:'davinci-resolve', status:'published', typ:'comparison', title:'DaVinci Resolve', category:'Programy', score:9.2, verdict:'PotÄ™ĹĽny kombajn, ktĂłry ciÄ…gle potrafi zaskoczyÄ‡.', author:'Kapi', date:'12 lipca' },
] satisfies Array<{ slug:string; status:StatusTresci; typ:TypMaterialuRecenzenckiego; title:string; category:string; score:number; verdict:string; author:string; date:string }>;

export const poll = {
  question:'KtĂłry materiaĹ‚ powinien powstaÄ‡ jako nastÄ™pny?',
  binding:false,
  options:[
    { label:'PorĂłwnanie przenoĹ›nych DAC-Ăłw USB-C', votes:46, category:'music' },
    { label:'Kulisy budowy VidEdit Studio', votes:34, category:'technical' },
    { label:'Jak automatyzujÄ™ pracÄ™ z BUR', votes:20, category:'experimental' },
  ] satisfies Array<{ label:string; votes:number; category:ProjectCategory }>,
};
