export type RolaUzytkownika = 'wlasciciel' | 'administrator' | 'moderator' | 'redaktor' | 'wspierajacy' | 'uzytkownik' | 'widz';

export type Uzytkownik = {
  id: string;
  email: string;
  nazwaWyswietlana: string;
  role: RolaUzytkownika[];
};

export type StanAutoryzacji = {
  uzytkownik: Uzytkownik | null;
  ladowanie: boolean;
};

export interface PortAutoryzacji {
  pobierzStan(): Promise<StanAutoryzacji>;
  zaloguj(email: string, haslo: string): Promise<boolean>;
  wyloguj(): Promise<void>;
}
