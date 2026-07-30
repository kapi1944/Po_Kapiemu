import { createContext } from 'react';
import type { Uzytkownik } from './portAutoryzacji';

export type KontekstAutoryzacji = {
  uzytkownik: Uzytkownik | null;
  ladowanie: boolean;
  zaloguj: (email: string, haslo: string) => Promise<boolean>;
  wyloguj: () => Promise<void>;
};

export const kontekstAutoryzacji = createContext<KontekstAutoryzacji | null>(null);
