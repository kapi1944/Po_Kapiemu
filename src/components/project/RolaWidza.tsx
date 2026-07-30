import { useEffect, useState } from 'react';
import type { RolaWidza } from '../../data/projectDetails';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';

const role: RolaWidza[] = ['guest', 'registered', 'supporter', 'author'];
const etykiety: Record<RolaWidza, string> = { guest:'Gość', registered:'Zalogowany', supporter:'Wspierający', author:'Autor' };

export function useRolaWidza(rolaSesji: RolaWidza) {
  const [nadpisanie, ustawNadpisanie] = useState<RolaWidza | null>(() => {
    if (!import.meta.env.DEV) return null;
    const wartosc = new URLSearchParams(window.location.search).get('rola');
    return role.includes(wartosc as RolaWidza) ? wartosc as RolaWidza : null;
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const adres = new URL(window.location.href);
    if (nadpisanie) adres.searchParams.set('rola', nadpisanie); else adres.searchParams.delete('rola');
    window.history.replaceState({}, '', adres);
  }, [nadpisanie]);

  return { rola:nadpisanie ?? rolaSesji, nadpisanie, ustawNadpisanie };
}

export function SelektorRoli({ rolaSesji, nadpisanie, ustawNadpisanie }: { rolaSesji:RolaWidza; nadpisanie:RolaWidza|null; ustawNadpisanie:(rola:RolaWidza|null) => void }) {
  if (!import.meta.env.DEV) return null;
  return <label className="selektor-roli">Rola demonstracyjna
    <select value={nadpisanie ?? ''} onChange={zdarzenie => ustawNadpisanie(zdarzenie.target.value ? zdarzenie.target.value as RolaWidza : null)}>
      <option value="">Sesja ({etykiety[rolaSesji]})</option>
      {role.map(wartosc => <option key={wartosc} value={wartosc}>{etykiety[wartosc]}</option>)}
    </select>
  </label>;
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

export function czyWidacPrzyszlyEtap(rola: RolaWidza, dostep: 'registered' | 'supporter') {
  return rola === 'author' || rola === 'supporter' || (rola === 'registered' && dostep === 'registered');
}
