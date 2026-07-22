export type RolaUzytkownika = 'wlasciciel' | 'administrator' | 'moderator' | 'redaktor' | 'uzytkownik';
export type MetodaLogowania = 'google' | 'magic-link';

export type Uzytkownik = {
  id: string;
  email: string | null;
  nazwaWyswietlana: string | null;
  role: RolaUzytkownika[];
};

export type StanAutoryzacji = {
  uzytkownik: Uzytkownik | null;
  ladowanie: boolean;
};

export interface PortAutoryzacji {
  pobierzStan(): Promise<StanAutoryzacji>;
  zalogujPrzezGoogle(): Promise<void>;
  wyslijMagicLink(email: string): Promise<void>;
  wyloguj(): Promise<void>;
}

// To jest wyłącznie kontrakt niezależny od dostawcy.
// Adapter do Supabase/Firebase/Appwrite/własnego backendu powstanie dopiero po decyzji nr 24.
