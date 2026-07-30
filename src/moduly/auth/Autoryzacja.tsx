import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Uzytkownik } from './portAutoryzacji';

type KontekstAutoryzacji = {
  uzytkownik: Uzytkownik | null;
  ladowanie: boolean;
  zaloguj: (email: string, haslo: string) => Promise<boolean>;
  wyloguj: () => Promise<void>;
};

const kontekstAutoryzacji = createContext<KontekstAutoryzacji | null>(null);

async function pobierzUzytkownikaSesji() {
  try {
    const odpowiedz = await fetch('/api/auth/session', { credentials: 'same-origin' });
    if (!odpowiedz.ok) return null;
    const dane = await odpowiedz.json() as { uzytkownik: Uzytkownik | null };
    return dane.uzytkownik;
  } catch {
    return null;
  }
}

export function DostawcaAutoryzacji({ children: dzieci }: { children: ReactNode }) {
  const [uzytkownik, ustawUzytkownika] = useState<Uzytkownik | null>(null);
  const [ladowanie, ustawLadowanie] = useState(true);

  useEffect(() => {
    void pobierzUzytkownikaSesji().then(ustawUzytkownika).finally(() => ustawLadowanie(false));
  }, []);

  const wartosc = useMemo<KontekstAutoryzacji>(() => ({
    uzytkownik,
    ladowanie,
    zaloguj: async (email, haslo) => {
      try {
        const odpowiedz = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, haslo }),
        });
        if (!odpowiedz.ok) return false;
        const dane = await odpowiedz.json() as { uzytkownik: Uzytkownik };
        ustawUzytkownika(dane.uzytkownik);
        return true;
      } catch {
        return false;
      }
    },
    wyloguj: async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
      ustawUzytkownika(null);
    },
  }), [ladowanie, uzytkownik]);

  return <kontekstAutoryzacji.Provider value={wartosc}>{dzieci}</kontekstAutoryzacji.Provider>;
}

export function useAutoryzacja() {
  const wartosc = useContext(kontekstAutoryzacji);
  if (!wartosc) throw new Error('useAutoryzacja wymaga DostawcyAutoryzacji.');
  return wartosc;
}

export function FormularzLogowania({ zamknij }: { zamknij: () => void }) {
  const { zaloguj } = useAutoryzacja();
  const [email, ustawEmail] = useState('');
  const [haslo, ustawHaslo] = useState('');
  const [blad, ustawBlad] = useState('');
  const [wysylanie, ustawWysylanie] = useState(false);
  const okno = useRef<HTMLDialogElement>(null);
  const elementOtwierajacy = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);

  useEffect(() => {
    const dialog = okno.current;
    if (!dialog) return;
    const poprzedniOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = poprzedniOverflow;
      elementOtwierajacy.current?.focus();
    };
  }, []);

  const obsluzWyslanie = async (zdarzenie: FormEvent<HTMLFormElement>) => {
    zdarzenie.preventDefault();
    ustawWysylanie(true);
    ustawBlad('');
    if (await zaloguj(email, haslo)) {
      zamknij();
      return;
    }
    ustawBlad('Nieprawidłowy e-mail lub hasło.');
    ustawWysylanie(false);
  };

  return <dialog
    ref={okno}
    className="okno-logowania"
    aria-labelledby="tytul-logowania"
    onCancel={zdarzenie => { zdarzenie.preventDefault(); zamknij(); }}
    onClick={zdarzenie => { if (zdarzenie.target === zdarzenie.currentTarget) zamknij(); }}
  >
    <form className="formularz-logowania" onSubmit={obsluzWyslanie} aria-busy={wysylanie}>
      <button className="formularz-logowania__zamknij" type="button" aria-label="Zamknij" onClick={zamknij}>×</button>
      <span className="section-kicker">STREFA UŻYTKOWNIKA</span>
      <h2 id="tytul-logowania">Zaloguj się</h2>
      <p>Podaj dane swojego konta.</p>
      <label>E-mail<input type="email" autoComplete="email" maxLength={254} value={email} onChange={zdarzenie => ustawEmail(zdarzenie.target.value)} required autoFocus/></label>
      <label>Hasło<input type="password" autoComplete="current-password" maxLength={72} value={haslo} onChange={zdarzenie => ustawHaslo(zdarzenie.target.value)} required/></label>
      {blad && <p className="formularz-logowania__blad" role="alert">{blad}</p>}
      <button className="button primary" type="submit" disabled={wysylanie}>{wysylanie ? 'Logowanie…' : 'Zaloguj się'}</button>
    </form>
  </dialog>;
}
