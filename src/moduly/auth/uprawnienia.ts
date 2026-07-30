import type { RolaUzytkownika, Uzytkownik } from './portAutoryzacji';
import type { RolaWidza } from '../../data/projectDetails';

export type UprawnieniaUzytkownika = {
  widocznoscProjektu: RolaWidza;
  mozeKomentowac: boolean;
  mozeGlosowac: boolean;
  mozeModerowac: boolean;
  mozeEdytowacProjekt: boolean;
};

const poziomyWidocznosci: Record<RolaWidza, number> = {
  guest: 0,
  registered: 1,
  supporter: 2,
  author: 3,
};

const uprawnieniaRol: Record<RolaUzytkownika, UprawnieniaUzytkownika> = {
  widz: { widocznoscProjektu:'registered', mozeKomentowac:false, mozeGlosowac:false, mozeModerowac:false, mozeEdytowacProjekt:false },
  uzytkownik: { widocznoscProjektu:'registered', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:false, mozeEdytowacProjekt:false },
  wspierajacy: { widocznoscProjektu:'supporter', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:false, mozeEdytowacProjekt:false },
  moderator: { widocznoscProjektu:'registered', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:true, mozeEdytowacProjekt:false },
  redaktor: { widocznoscProjektu:'author', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:false, mozeEdytowacProjekt:true },
  administrator: { widocznoscProjektu:'author', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:true, mozeEdytowacProjekt:true },
  wlasciciel: { widocznoscProjektu:'author', mozeKomentowac:true, mozeGlosowac:true, mozeModerowac:true, mozeEdytowacProjekt:true },
};

const brakUprawnien: UprawnieniaUzytkownika = {
  widocznoscProjektu: 'guest',
  mozeKomentowac: false,
  mozeGlosowac: false,
  mozeModerowac: false,
  mozeEdytowacProjekt: false,
};

export function wyznaczUprawnienia(uzytkownik: Uzytkownik | null): UprawnieniaUzytkownika {
  if (!uzytkownik) return { ...brakUprawnien };

  return uzytkownik.role.reduce<UprawnieniaUzytkownika>((wynik, rola) => {
    const biezace = uprawnieniaRol[rola];
    if (!biezace) return wynik;
    return {
      widocznoscProjektu: poziomyWidocznosci[biezace.widocznoscProjektu] > poziomyWidocznosci[wynik.widocznoscProjektu]
        ? biezace.widocznoscProjektu
        : wynik.widocznoscProjektu,
      mozeKomentowac: wynik.mozeKomentowac || biezace.mozeKomentowac,
      mozeGlosowac: wynik.mozeGlosowac || biezace.mozeGlosowac,
      mozeModerowac: wynik.mozeModerowac || biezace.mozeModerowac,
      mozeEdytowacProjekt: wynik.mozeEdytowacProjekt || biezace.mozeEdytowacProjekt,
    };
  }, { ...brakUprawnien, widocznoscProjektu:'registered' });
}

const etykietyRol: Record<RolaUzytkownika, string> = {
  wlasciciel: 'Właściciel',
  administrator: 'Administrator',
  moderator: 'Moderator',
  redaktor: 'Redaktor',
  wspierajacy: 'Wspierający',
  uzytkownik: 'Użytkownik',
  widz: 'Widz',
};

const priorytetRol: RolaUzytkownika[] = ['wlasciciel', 'administrator', 'redaktor', 'moderator', 'wspierajacy', 'uzytkownik', 'widz'];

export function etykietaGlownejRoli(role: RolaUzytkownika[]) {
  const rola = priorytetRol.find(element => role.includes(element));
  return rola ? etykietyRol[rola] : 'Konto';
}
