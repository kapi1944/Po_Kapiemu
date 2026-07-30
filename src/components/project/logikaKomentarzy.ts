export type StanModeracjiKomentarza = 'zatwierdzony' | 'oczekujacy' | 'odrzucony';

export type KomentarzProjektu = {
  id: string;
  tresc: string;
  autor: string;
  autorId?: string;
  czlonekZespolu?: boolean;
  autorProjektu?: boolean;
  poziom: number;
  rodzic?: string;
  stanModeracji: StanModeracjiKomentarza;
  przypiety?: boolean;
  plus: number;
  minus: number;
};

export type WezelKomentarza = KomentarzProjektu & { dzieci: WezelKomentarza[] };

export function kluczKomentarzy(projectSlug: string, context: 'project' | 'step', stepId?: string) {
  return context === 'step'
    ? `pk-project-comments-v2:${projectSlug}:step:${stepId ?? ''}`
    : `pk-project-comments-v2:${projectSlug}:project`;
}

export function czyMoznaOdpowiedziec(komentarz: Pick<KomentarzProjektu, 'poziom'>) {
  return komentarz.poziom < 3;
}

export function zbudujDrzewoKomentarzy(komentarze: KomentarzProjektu[]): WezelKomentarza[] {
  const wezly = new Map(komentarze.map(komentarz => [komentarz.id, { ...komentarz, dzieci:[] as WezelKomentarza[] }]));
  const korzenie: WezelKomentarza[] = [];

  const tworzyCykl = (id: string, rodzicId: string) => {
    const odwiedzone = new Set([id]);
    let biezacy: string | undefined = rodzicId;
    while (biezacy) {
      if (odwiedzone.has(biezacy)) return true;
      odwiedzone.add(biezacy);
      biezacy = wezly.get(biezacy)?.rodzic;
    }
    return false;
  };

  wezly.forEach(wezel => {
    const rodzic = wezel.rodzic ? wezly.get(wezel.rodzic) : undefined;
    if (rodzic && !tworzyCykl(wezel.id, rodzic.id)) rodzic.dzieci.push(wezel);
    else korzenie.push(wezel);
  });

  const ustawPoziom = (wezel: WezelKomentarza, poziom: number) => {
    wezel.poziom = poziom;
    wezel.dzieci.forEach(dziecko => ustawPoziom(dziecko, poziom + 1));
  };
  korzenie.forEach(korzen => ustawPoziom(korzen, 0));
  korzenie.sort((a, b) => Number(Boolean(b.przypiety)) - Number(Boolean(a.przypiety)));
  return korzenie;
}

export function normalizujKomentarze(wartosc: unknown): KomentarzProjektu[] {
  if (!Array.isArray(wartosc)) return [];
  return wartosc.flatMap((element): KomentarzProjektu[] => {
    if (!element || typeof element !== 'object') return [];
    const dane = element as Record<string, unknown>;
    if (typeof dane.id !== 'string' || typeof dane.tresc !== 'string' || typeof dane.autor !== 'string') return [];
    return [{
      id: dane.id,
      tresc: dane.tresc,
      autor: dane.autor,
      autorId: typeof dane.autorId === 'string' ? dane.autorId : undefined,
      czlonekZespolu: dane.czlonekZespolu === true,
      autorProjektu: dane.autorProjektu === true || dane.autor === 'Kapi',
      poziom: typeof dane.poziom === 'number' ? dane.poziom : 0,
      rodzic: typeof dane.rodzic === 'string' ? dane.rodzic : undefined,
      stanModeracji: dane.stanModeracji === 'odrzucony' || dane.stanModeracji === 'oczekujacy'
        ? dane.stanModeracji
        : dane.pending === true ? 'oczekujacy' : 'zatwierdzony',
      przypiety: dane.przypiety === true,
      plus: typeof dane.plus === 'number' ? dane.plus : 0,
      minus: typeof dane.minus === 'number' ? dane.minus : 0,
    }];
  });
}
