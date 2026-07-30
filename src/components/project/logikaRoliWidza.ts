import { useEffect, useState } from 'react';
import type { RolaWidza } from '../../data/projectDetails';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';

const role: RolaWidza[] = ['guest', 'registered', 'supporter', 'author'];

export function useRolaWidza(rolaSesji: RolaWidza) {
  const [nadpisanie, ustawNadpisanie] = useState<RolaWidza | null>(() => {
    if (!import.meta.env.DEV) return null;
    const wartosc = new URLSearchParams(window.location.search).get('rola');
    return role.includes(wartosc as RolaWidza) ? wartosc as RolaWidza : null;
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const adres = new URL(window.location.href);
    if (nadpisanie) adres.searchParams.set('rola', nadpisanie);
    else adres.searchParams.delete('rola');
    window.history.replaceState({}, '', adres);
  }, [nadpisanie]);

  return { rola:nadpisanie ?? rolaSesji, nadpisanie, ustawNadpisanie };
}

export function wyznaczUprawnieniaTestowe(rola: RolaWidza): UprawnieniaUzytkownika {
  return {
    widocznoscProjektu: rola,
    mozeKomentowac: rola !== 'guest',
    mozeGlosowac: rola !== 'guest',
    mozeModerowac: rola === 'author',
    mozeEdytowacProjekt: rola === 'author',
  };
}
