import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { GlosowanieProjektu as DaneGlosowania, PunktGalerii, SzczegolyProjektu } from '../../data/projectDetails';
import type { Project } from '../../data/siteData';
import type { Uzytkownik } from '../../moduly/auth/portAutoryzacji';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { GaleriaProjektu } from './GaleriaProjektu';
import { GlosowanieProjektu } from './GlosowanieProjektu';
import { KomentarzeProjektu } from './KomentarzeProjektu';
import { kluczKomentarzy } from './logikaKomentarzy';
import { StatusProjektu } from './StatusProjektu';

const uzytkownikA: Uzytkownik = {
  id:'konto-a',
  email:'a@example.com',
  nazwaWyswietlana:'Anna',
  role:['uzytkownik'],
};
const uzytkownikB: Uzytkownik = {
  id:'konto-b',
  email:'b@example.com',
  nazwaWyswietlana:'Bartek',
  role:['uzytkownik'],
};
const uprawnieniaUzytkownika: UprawnieniaUzytkownika = {
  widocznoscProjektu:'registered',
  mozeKomentowac:true,
  mozeGlosowac:true,
  mozeModerowac:false,
  mozeEdytowacProjekt:false,
};
const uprawnieniaAutora: UprawnieniaUzytkownika = {
  widocznoscProjektu:'author',
  mozeKomentowac:true,
  mozeGlosowac:true,
  mozeModerowac:true,
  mozeEdytowacProjekt:true,
};
const projekt: Project = {
  slug:'test-dojrzalosci',
  title:'Test dojrzałości',
  eyebrow:'Test',
  description:'Opis',
  status:'W realizacji',
  progress:45,
  category:'technical',
  active:true,
  highlights:[],
};
const szczegoly: SzczegolyProjektu = {
  slug:'test-dojrzalosci',
  rozpoczecie:'2026-01-01',
  aktualizacja:'2026-01-02',
  dojrzalosc:'Koncepcja',
  aktualnyEtap:'Implementacja',
  obserwujacy:1,
  kamienieGlowne:[{ id:'realizacja', tytul:'Realizacja', status:'W realizacji' }],
  aktualizacje:[{ id:'wpis', tresc:'Gotowy prototyp' }],
};
const glosowanie: DaneGlosowania[] = [{
  id:'wybor',
  pytanie:'Którą opcję wybierasz?',
  aktywne:true,
  opcje:[
    { id:'a', etykieta:'Opcja A', glosy:2 },
    { id:'b', etykieta:'Opcja B', glosy:1 },
  ],
}];

function dodajKomentarz(tresc: string) {
  fireEvent.change(screen.getByLabelText('Komentarz'), { target:{ value:tresc } });
  fireEvent.click(screen.getByRole('button', { name:'Opublikuj' }));
}

describe('dojrzałość projektu', () => {
  it('stosuje sugestię i zapisuje nową dojrzałość', () => {
    render(<StatusProjektu projekt={projekt} szczegoly={szczegoly} uprawnienia={uprawnieniaAutora}/>);
    fireEvent.click(screen.getByRole('button', { name:'Zastosuj sugestię' }));

    expect(screen.getByText(/Dojrzałość:/).textContent).toContain('Prototyp działający');
    expect(JSON.parse(localStorage.getItem('pk-project-maturity-v2:test-dojrzalosci') ?? '{}')).toEqual({
      wartosc:'Prototyp działający',
      sugestia:'zastosowana',
    });
  });

  it('pamięta odrzucenie sugestii po ponownym montowaniu', () => {
    const pierwszy = render(<StatusProjektu projekt={projekt} szczegoly={szczegoly} uprawnienia={uprawnieniaAutora}/>);
    fireEvent.click(screen.getByRole('button', { name:'Odrzuć' }));
    pierwszy.unmount();
    render(<StatusProjektu projekt={projekt} szczegoly={szczegoly} uprawnienia={uprawnieniaAutora}/>);

    expect(screen.queryByRole('button', { name:'Odrzuć' })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('pk-project-maturity-v2:test-dojrzalosci') ?? '{}').sugestia).toBe('odrzucona');
  });
});

describe('komentarze projektu', () => {
  it('izoluje komentarze między projektami', () => {
    const pierwszy = render(<KomentarzeProjektu projectSlug="projekt-a" context="project" uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    dodajKomentarz('Komentarz tylko w projekcie A');
    pierwszy.unmount();

    render(<KomentarzeProjektu projectSlug="projekt-b" context="project" uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    expect(screen.queryByText('Komentarz tylko w projekcie A')).not.toBeInTheDocument();
  });

  it('izoluje komentarze między krokami instrukcji', () => {
    const pierwszy = render(<KomentarzeProjektu projectSlug="projekt-a" context="step" stepId="krok-1" uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    dodajKomentarz('Komentarz tylko dla kroku 1');
    pierwszy.unmount();

    render(<KomentarzeProjektu projectSlug="projekt-a" context="step" stepId="krok-2" uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    expect(screen.queryByText('Komentarz tylko dla kroku 1')).not.toBeInTheDocument();
  });

  it('moderacja nie przypina komentarza', () => {
    const klucz = kluczKomentarzy('projekt-moderowany', 'project');
    localStorage.setItem(klucz, JSON.stringify([{
      id:'oczekujacy',
      tresc:'Komentarz oczekujący',
      autor:'Autor',
      poziom:0,
      stanModeracji:'oczekujacy',
      plus:0,
      minus:0,
    }]));
    render(<KomentarzeProjektu projectSlug="projekt-moderowany" context="project" uzytkownik={uzytkownikA} uprawnienia={uprawnieniaAutora}/>);
    fireEvent.click(screen.getByRole('button', { name:'Zatwierdź' }));

    const zapisany = JSON.parse(localStorage.getItem(klucz) ?? '[]')[0];
    expect(zapisany.stanModeracji).toBe('zatwierdzony');
    expect(zapisany.przypiety).not.toBe(true);
  });
});

describe('głosowania', () => {
  it('izoluje głosy między projektami', () => {
    const pierwszy = render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={glosowanie} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    fireEvent.click(screen.getByRole('button', { name:'Opcja A' }));
    pierwszy.unmount();

    render(<GlosowanieProjektu projectSlug="projekt-b" glosowania={glosowanie} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    expect(screen.queryByText(/Głos został zapisany/)).not.toBeInTheDocument();
  });

  it('izoluje głosy kont A i B', () => {
    const pierwszy = render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={glosowanie} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    fireEvent.click(screen.getByRole('button', { name:'Opcja B' }));
    pierwszy.unmount();

    render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={glosowanie} uzytkownik={uzytkownikB} uprawnienia={uprawnieniaUzytkownika}/>);
    expect(screen.queryByText(/Głos został zapisany/)).not.toBeInTheDocument();
  });

  it('ukrywa wyniki przed głosem i pokazuje je po głosie', () => {
    render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={glosowanie} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name:'Opcja A' }));
    expect(screen.getAllByText(/%/)).toHaveLength(2);
  });

  it('nie pozwala zmienić oddanego głosu', () => {
    render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={glosowanie} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);
    fireEvent.click(screen.getByRole('button', { name:'Opcja A' }));

    expect(screen.getByRole('button', { name:/Opcja A/ })).toBeDisabled();
    expect(screen.getByRole('button', { name:/Opcja B/ })).toBeDisabled();
    expect(JSON.parse(localStorage.getItem('pk-project-polls-v2:projekt-a:konto-a') ?? '{}')).toEqual({ wybor:'a' });
  });

  it('renderuje obraz opcji głosowania', () => {
    const zObrazem: DaneGlosowania[] = [{
      ...glosowanie[0],
      opcje:[{ id:'a', etykieta:'Opcja A', glosy:0, obraz:'/opcja-a.png' }],
    }];
    render(<GlosowanieProjektu projectSlug="projekt-a" glosowania={zObrazem} uzytkownik={uzytkownikA} uprawnienia={uprawnieniaUzytkownika}/>);

    expect(screen.getByRole('img', { name:'Opcja: Opcja A' })).toHaveAttribute('src', '/opcja-a.png');
  });
});

describe('galeria', () => {
  it('renderuje film jako video w oknie dialogowym', async () => {
    const punkty: PunktGalerii[] = [{
      id:'film',
      data:'2026-01-01',
      tytul:'Film',
      media:[{ id:'film-1', typ:'video', url:'/film.mp4', opis:'Nagranie testowe' }],
    }];
    render(<GaleriaProjektu punkty={punkty}/>);
    fireEvent.click(screen.getByRole('button', { name:/Pełny ekran/ }));

    await waitFor(() => expect(screen.getByRole('dialog')).toHaveAttribute('open'));
    expect(screen.getByRole('dialog').querySelector('video')).toHaveAttribute('src', '/film.mp4');
  });

  it('bezpiecznie obsługuje pusty punkt galerii', () => {
    render(<GaleriaProjektu punkty={[{ id:'pusty', data:'2026-01-01', tytul:'Pusty punkt', media:[] }]}/>);
    expect(screen.getByText('Ten punkt galerii nie zawiera jeszcze mediów.')).toBeInTheDocument();
  });
});
