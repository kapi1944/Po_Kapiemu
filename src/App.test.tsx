import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

function odpowiedzSesji(uzytkownik: unknown) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ uzytkownik }), {
    status:200,
    headers:{ 'Content-Type':'application/json' },
  })));
}

describe('dostęp do zablokowanego projektu', () => {
  it('odblokowuje projekt po potwierdzeniu sesji', async () => {
    odpowiedzSesji({
      id:'konto-1',
      email:'osoba@example.com',
      nazwaWyswietlana:'Osoba',
      role:['widz'],
    });
    window.history.replaceState({}, '', '/projekty/projekt-lab');
    render(<App/>);

    expect(await screen.findByRole('heading', { name:'Projekt LAB' })).toBeInTheDocument();
    expect(screen.queryByText(/widoczny tylko dla zalogowanych/)).not.toBeInTheDocument();
  });

  it('pozostawia projekt zablokowany dla gościa', async () => {
    odpowiedzSesji(null);
    window.history.replaceState({}, '', '/projekty/projekt-lab');
    render(<App/>);

    expect(await screen.findByText('Ten projekt jest widoczny tylko dla zalogowanych użytkowników.')).toBeInTheDocument();
  });
});
