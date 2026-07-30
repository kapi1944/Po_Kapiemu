import { describe, expect, it } from 'vitest';
import type { SzczegolyProjektu } from '../../data/projectDetails';
import type { Project } from '../../data/siteData';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import { wyznaczUprawnienia } from '../../moduly/auth/uprawnienia';
import { pobierzDostepneSekcje } from './rejestrSekcjiProjektu';
import { kluczGlosow } from './logikaGlosowan';
import { czyMoznaOdpowiedziec, kluczKomentarzy, zbudujDrzewoKomentarzy, type KomentarzProjektu } from './logikaKomentarzy';
import { pobierzWyroznioneSekcje } from './logikaSekcji';
import { ograniczPostep, pobierzWidocznePrzyszleEtapy, wyznaczIndeksAktualnegoKamienia, wyznaczStanyKamieni } from './logikaStatusu';

function uzytkownik(role: Uzytkownik['role']): Uzytkownik {
  return { id:'1', email:'osoba@example.com', nazwaWyswietlana:'Osoba', role };
}

function szczegoly(nadpisanie: Partial<SzczegolyProjektu> = {}): SzczegolyProjektu {
  return {
    slug:'test',
    rozpoczecie:'2026-01-01',
    aktualizacja:'2026-01-02',
    dojrzalosc:'Koncepcja',
    aktualnyEtap:'Realizacja',
    obserwujacy:0,
    kamienieGlowne:[
      { id:'pomysl', tytul:'Pomysł', status:'Pomysł' },
      { id:'realizacja', tytul:'Realizacja', status:'W realizacji' },
      { id:'testy', tytul:'Testy', status:'Testowanie' },
    ],
    ...nadpisanie,
  };
}

const projekt: Project = {
  slug:'test',
  title:'Projekt testowy',
  eyebrow:'Test',
  description:'Opis',
  status:'W realizacji',
  progress:50,
  category:'technical',
  active:true,
  highlights:[],
};

describe('role i widoczność', () => {
  it('mapuje każdą rolę na właściwy zestaw uprawnień', () => {
    expect(wyznaczUprawnienia(uzytkownik(['widz']))).toMatchObject({ widocznoscProjektu:'registered', mozeKomentowac:false, mozeGlosowac:false });
    expect(wyznaczUprawnienia(uzytkownik(['uzytkownik']))).toMatchObject({ mozeKomentowac:true, mozeGlosowac:true });
    expect(wyznaczUprawnienia(uzytkownik(['wspierajacy']))).toMatchObject({ widocznoscProjektu:'supporter' });
    expect(wyznaczUprawnienia(uzytkownik(['moderator']))).toMatchObject({ mozeModerowac:true, mozeEdytowacProjekt:false });
    expect(wyznaczUprawnienia(uzytkownik(['redaktor']))).toMatchObject({ widocznoscProjektu:'author', mozeEdytowacProjekt:true });
    expect(wyznaczUprawnienia(uzytkownik(['administrator']))).toMatchObject({ mozeModerowac:true, mozeEdytowacProjekt:true });
    expect(wyznaczUprawnienia(uzytkownik(['wlasciciel']))).toMatchObject({ widocznoscProjektu:'author', mozeModerowac:true });
  });

  it('łączy wiele ról bez utraty najmocniejszych uprawnień', () => {
    expect(wyznaczUprawnienia(uzytkownik(['widz', 'moderator', 'wspierajacy']))).toEqual({
      widocznoscProjektu:'supporter',
      mozeKomentowac:true,
      mozeGlosowac:true,
      mozeModerowac:true,
      mozeEdytowacProjekt:false,
    });
  });

  it('widz nie może pisać ani głosować', () => {
    const wynik = wyznaczUprawnienia(uzytkownik(['widz']));
    expect(wynik.mozeKomentowac).toBe(false);
    expect(wynik.mozeGlosowac).toBe(false);
  });

  it('wspierający widzi wszystkie przyszłe etapy', () => {
    const etapy = [
      { id:'a', tytul:'A', dostep:'registered' as const },
      { id:'b', tytul:'B', dostep:'supporter' as const },
      { id:'c', tytul:'C', dostep:'supporter' as const },
    ];
    expect(pobierzWidocznePrzyszleEtapy(etapy, wyznaczUprawnienia(uzytkownik(['wspierajacy'])))).toEqual(etapy);
  });
});

describe('status projektu', () => {
  it('używa jawnego identyfikatora aktualnego kamienia', () => {
    expect(wyznaczIndeksAktualnegoKamienia('W realizacji', szczegoly({ aktualnyKamienId:'testy' }))).toBe(2);
  });

  it('stosuje bezpieczny fallback po statusie', () => {
    expect(wyznaczIndeksAktualnegoKamienia('W realizacji', szczegoly({ aktualnyKamienId:'brak' }))).toBe(1);
  });

  it('oznacza dokładnie jeden kamień jako obecny', () => {
    const stany = wyznaczStanyKamieni('W realizacji', szczegoly());
    expect(stany.filter(element => element.stan === 'obecny')).toHaveLength(1);
  });

  it('oznacza poprzednie jako ukończone, a kolejne jako przyszłe', () => {
    expect(wyznaczStanyKamieni('W realizacji', szczegoly()).map(element => element.stan)).toEqual([
      'ukonczony',
      'obecny',
      'przyszly',
    ]);
  });

  it('ogranicza postęp do zakresu 0–100', () => {
    expect(ograniczPostep(-12)).toBe(0);
    expect(ograniczPostep(64)).toBe(64);
    expect(ograniczPostep(140)).toBe(100);
  });
});

describe('izolacja danych i puste sekcje', () => {
  it('buduje klucz komentarzy z projektu i kroku', () => {
    expect(kluczKomentarzy('projekt-a', 'project')).toBe('pk-project-comments-v2:projekt-a:project');
    expect(kluczKomentarzy('projekt-a', 'step', 'krok-2')).toBe('pk-project-comments-v2:projekt-a:step:krok-2');
  });

  it('buduje klucz głosu z projektu i użytkownika', () => {
    expect(kluczGlosow('projekt-a', 'uzytkownik-b')).toBe('pk-project-polls-v2:projekt-a:uzytkownik-b');
  });

  it('drzewo komentarzy zachowuje relacje rodziców', () => {
    const komentarze: KomentarzProjektu[] = [
      { id:'a', tresc:'A', autor:'A', poziom:0, stanModeracji:'zatwierdzony', plus:0, minus:0 },
      { id:'b', tresc:'B', autor:'B', rodzic:'a', poziom:1, stanModeracji:'zatwierdzony', plus:0, minus:0 },
      { id:'c', tresc:'C', autor:'C', rodzic:'b', poziom:2, stanModeracji:'zatwierdzony', plus:0, minus:0 },
    ];
    const drzewo = zbudujDrzewoKomentarzy(komentarze);
    expect(drzewo[0].dzieci[0].dzieci[0].id).toBe('c');
  });

  it('dopuszcza poziom 3, ale blokuje odpowiedź tworzącą poziom 4', () => {
    expect(czyMoznaOdpowiedziec({ poziom:2 })).toBe(true);
    expect(czyMoznaOdpowiedziec({ poziom:3 })).toBe(false);
  });

  it('zachowuje świadomie pustą listę wyróżnionych sekcji', () => {
    localStorage.setItem('pk-section-featured-test', '[]');
    expect(pobierzWyroznioneSekcje('test', ['najwazniejsze'], ['najwazniejsze'])).toEqual([]);
  });

  it('ukrywa sekcje pozbawione danych', () => {
    const sekcje = pobierzDostepneSekcje({
      projekt,
      szczegoly:szczegoly(),
      projectSlug:'test',
      uzytkownik:null,
      uprawnienia:wyznaczUprawnienia(null),
    }).map(sekcja => sekcja.id);

    expect(sekcje).toEqual(['komentarze']);
    expect(sekcje).not.toContain('najwazniejsze');
    expect(sekcje).not.toContain('repozytorium');
    expect(sekcje).not.toContain('spolecznosc');
  });
});
