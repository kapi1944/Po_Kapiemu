import { useMemo, useState } from 'react';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { Icon } from '../Icons';
import { czyMoznaOdpowiedziec, kluczKomentarzy, normalizujKomentarze, type KomentarzProjektu as DaneKomentarza, type StanModeracjiKomentarza, type WezelKomentarza, zbudujDrzewoKomentarzy } from './logikaKomentarzy';

const niedozwolone = ['idiota', 'głupi', 'glupi'];
const limitKomentarza = 2000;

function komentarzStartowy(): DaneKomentarza {
  return {
    id:'start',
    tresc:'Dajcie znać, które materiały są najbardziej potrzebne.',
    autor:'Kapi',
    autorProjektu:true,
    czlonekZespolu:true,
    poziom:0,
    stanModeracji:'zatwierdzony',
    przypiety:true,
    plus:4,
    minus:0,
  };
}

function wczytajKomentarze(projectSlug: string, context: 'project' | 'step', stepId?: string) {
  const klucz = kluczKomentarzy(projectSlug, context, stepId);
  try {
    const zapis = localStorage.getItem(klucz);
    if (zapis !== null) return normalizujKomentarze(JSON.parse(zapis));

    if (projectSlug === 'po-kapiemu' && context === 'project' && localStorage.getItem('pk-project-comments-v2:migrated:po-kapiemu') !== '1') {
      const staryZapis = localStorage.getItem('pk-comments-v1');
      if (staryZapis) {
        const zmigrowane = normalizujKomentarze(JSON.parse(staryZapis));
        localStorage.setItem(klucz, JSON.stringify(zmigrowane));
        localStorage.setItem('pk-project-comments-v2:migrated:po-kapiemu', '1');
        return zmigrowane;
      }
    }
  } catch {
    return [];
  }
  return projectSlug === 'po-kapiemu' && context === 'project' ? [komentarzStartowy()] : [];
}

function utworzIdKomentarza() {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `komentarz-${Date.now()}-${Math.random()}`;
}

type WlasciwosciKomentarzy = {
  projectSlug: string;
  context: 'project' | 'step';
  stepId?: string;
  uzytkownik: Uzytkownik | null;
  uprawnienia: UprawnieniaUzytkownika;
};

function Komentarz({ wezel, uprawnienia, uzytkownik, odpowiedz, reakcja, zglos, moderuj, przypnij }: {
  wezel: WezelKomentarza;
  uprawnienia: UprawnieniaUzytkownika;
  uzytkownik: Uzytkownik | null;
  odpowiedz: (komentarz:DaneKomentarza) => void;
  reakcja: (id:string, pole:'plus'|'minus') => void;
  zglos: () => void;
  moderuj: (id:string, stan:StanModeracjiKomentarza) => void;
  przypnij: (id:string, wartosc:boolean) => void;
}) {
  return <div className="komentarz-galaz">
    <article className={`komentarz komentarz--${wezel.stanModeracji}`}>
      {wezel.przypiety && <small><Icon name="pin" size={12}/> Przypięty wątek</small>}
      <b>{wezel.autor}{wezel.autorProjektu && ' · Autor projektu'}{!wezel.autorProjektu && wezel.czlonekZespolu && ' · Członek zespołu'}{wezel.autorId === uzytkownik?.id && ' · Ty'}</b>
      {wezel.stanModeracji === 'oczekujacy' && <small>Oczekuje na moderację.</small>}
      {wezel.stanModeracji === 'odrzucony' ? <p>Ten komentarz został odrzucony.</p> : <p>{wezel.tresc}</p>}
      <div>
        <button type="button" aria-label="Przydatny komentarz" onClick={() => reakcja(wezel.id, 'plus')}><Icon name="thumbsUp" size={14}/>{wezel.plus}</button>
        <button type="button" aria-label="Nieprzydatny komentarz" onClick={() => reakcja(wezel.id, 'minus')}><Icon name="thumbsDown" size={14}/>{wezel.minus}</button>
        <button type="button" aria-label="Zgłoś komentarz" onClick={zglos}><Icon name="flag" size={14}/></button>
        {uprawnienia.mozeKomentowac && czyMoznaOdpowiedziec(wezel) && wezel.stanModeracji !== 'odrzucony' && <button type="button" onClick={() => odpowiedz(wezel)}>Odpowiedz</button>}
        {uprawnienia.mozeModerowac && wezel.stanModeracji !== 'zatwierdzony' && <button type="button" onClick={() => moderuj(wezel.id, 'zatwierdzony')}>Zatwierdź</button>}
        {uprawnienia.mozeModerowac && wezel.stanModeracji !== 'odrzucony' && <button type="button" onClick={() => moderuj(wezel.id, 'odrzucony')}>Odrzuć</button>}
        {uprawnienia.mozeModerowac && wezel.poziom === 0 && <button type="button" onClick={() => przypnij(wezel.id, !wezel.przypiety)}>{wezel.przypiety ? 'Odepnij' : 'Przypnij'}</button>}
      </div>
    </article>
    {wezel.dzieci.length > 0 && <div className="komentarz-dzieci">{wezel.dzieci.map(dziecko => <Komentarz key={dziecko.id} wezel={dziecko} uprawnienia={uprawnienia} uzytkownik={uzytkownik} odpowiedz={odpowiedz} reakcja={reakcja} zglos={zglos} moderuj={moderuj} przypnij={przypnij}/>)}</div>}
  </div>;
}

export function KomentarzeProjektu({ projectSlug, context, stepId, uzytkownik, uprawnienia }: WlasciwosciKomentarzy) {
  const klucz = kluczKomentarzy(projectSlug, context, stepId);
  const [komentarze, ustawKomentarze] = useState<DaneKomentarza[]>(() => wczytajKomentarze(projectSlug, context, stepId));
  const [tresc, ustawTresc] = useState('');
  const [odpowiedz, ustawOdpowiedz] = useState<DaneKomentarza>();
  const [wiadomosc, ustawWiadomosc] = useState('');
  const [filtr, ustawFiltr] = useState<'wszystkie' | StanModeracjiKomentarza>('wszystkie');

  const zapisz = (nowe: DaneKomentarza[]) => {
    ustawKomentarze(nowe);
    localStorage.setItem(klucz, JSON.stringify(nowe));
  };

  const dodaj = () => {
    const gotowaTresc = tresc.trim();
    if (!gotowaTresc || gotowaTresc.length > limitKomentarza || !uprawnienia.mozeKomentowac) return;
    if (odpowiedz && !czyMoznaOdpowiedziec(odpowiedz)) {
      ustawWiadomosc('Osiągnięto maksymalny poziom odpowiedzi.');
      return;
    }
    const role = uzytkownik?.role ?? [];
    const autorProjektu = role.includes('wlasciciel');
    const czlonekZespolu = autorProjektu || role.some(rola => ['administrator', 'moderator', 'redaktor'].includes(rola));
    const stanModeracji = niedozwolone.some(slowo => gotowaTresc.toLowerCase().includes(slowo)) ? 'oczekujacy' : 'zatwierdzony';
    zapisz([...komentarze, {
      id:utworzIdKomentarza(),
      tresc:gotowaTresc,
      autor:uzytkownik?.nazwaWyswietlana ?? 'Użytkownik demonstracyjny',
      autorId:uzytkownik?.id ?? 'dev-user',
      autorProjektu,
      czlonekZespolu,
      poziom:odpowiedz ? odpowiedz.poziom + 1 : 0,
      rodzic:odpowiedz?.id,
      stanModeracji,
      plus:0,
      minus:0,
    }]);
    ustawTresc('');
    ustawOdpowiedz(undefined);
    ustawWiadomosc(stanModeracji === 'oczekujacy' ? 'Komentarz przekazano do moderacji.' : 'Komentarz opublikowano.');
  };

  const widoczne = useMemo(() => komentarze.filter(komentarz => {
    if (filtr !== 'wszystkie' && komentarz.stanModeracji !== filtr) return false;
    return komentarz.stanModeracji === 'zatwierdzony' || uprawnienia.mozeModerowac || komentarz.autorId === uzytkownik?.id;
  }), [filtr, komentarze, uprawnienia.mozeModerowac, uzytkownik?.id]);
  const drzewo = useMemo(() => zbudujDrzewoKomentarzy(widoczne), [widoczne]);
  const reakcja = (id: string, pole: 'plus' | 'minus') => zapisz(komentarze.map(komentarz => komentarz.id === id ? { ...komentarz, [pole]:komentarz[pole] + 1 } : komentarz));
  const moderuj = (id: string, stanModeracji: StanModeracjiKomentarza) => zapisz(komentarze.map(komentarz => komentarz.id === id ? { ...komentarz, stanModeracji } : komentarz));
  const przypnij = (id: string, przypiety: boolean) => zapisz(komentarze.map(komentarz => komentarz.id === id ? { ...komentarz, przypiety } : komentarz));
  const przekroczonyLimit = tresc.length > limitKomentarza;

  return <div className="komentarze-projektu">
    <div className="kompozytor-komentarza">
      {!uprawnienia.mozeKomentowac
        ? <p>{uzytkownik ? 'Twoja rola pozwala czytać komentarze, ale nie pozwala ich publikować.' : 'Zaloguj się, aby dodać komentarz.'}</p>
        : <>
          {odpowiedz && <div className="odpowiedz-kontekst"><span>Odpowiadasz użytkownikowi: <b>{odpowiedz.autor}</b></span><button type="button" onClick={() => ustawOdpowiedz(undefined)}>Anuluj odpowiedź</button></div>}
          <label>{odpowiedz ? 'Odpowiedź' : 'Komentarz'}<textarea maxLength={limitKomentarza + 1} value={tresc} onChange={zdarzenie => ustawTresc(zdarzenie.target.value)} /></label>
          <div className="kompozytor-komentarza__stopka"><small className={przekroczonyLimit ? 'limit-przekroczony' : ''}>{tresc.length}/{limitKomentarza}</small><button type="button" className="button compact" disabled={!tresc.trim() || przekroczonyLimit} onClick={dodaj}>Opublikuj</button></div>
        </>}
    </div>
    {uprawnienia.mozeModerowac && <label className="filtr-komentarzy">Filtr demonstracyjny<select value={filtr} onChange={zdarzenie => ustawFiltr(zdarzenie.target.value as typeof filtr)}><option value="wszystkie">Wszystkie</option><option value="zatwierdzony">Zatwierdzone</option><option value="oczekujacy">Oczekujące</option><option value="odrzucony">Odrzucone</option></select></label>}
    <div className="drzewo-komentarzy">{drzewo.map(wezel => <Komentarz key={wezel.id} wezel={wezel} uprawnienia={uprawnienia} uzytkownik={uzytkownik} odpowiedz={ustawOdpowiedz} reakcja={reakcja} zglos={() => ustawWiadomosc('Zgłoszenie zapisano w demonstratorze.')} moderuj={moderuj} przypnij={przypnij}/>)}</div>
    {wiadomosc && <p className="komunikat-komentarza" role="status">{wiadomosc}</p>}
  </div>;
}
