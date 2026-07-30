import type { ProjectStatus } from '../../data/siteData';
import type { EtapPrzyszly, KamienMilowy, SzczegolyProjektu } from '../../data/projectDetails';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';

export const linioweStatusyProjektu: ProjectStatus[] = ['Pomysł', 'Planowanie', 'Przygotowanie', 'W realizacji', 'Testowanie', 'Dopracowywanie', 'Ukończony'];

export type StanKamienia = 'ukonczony' | 'obecny' | 'przyszly';
export type KamienZeStanem = KamienMilowy & { stan: StanKamienia };

export function ograniczPostep(wartosc: number) {
  if (!Number.isFinite(wartosc)) return 0;
  return Math.min(100, Math.max(0, wartosc));
}

export function wyznaczIndeksAktualnegoKamienia(status: ProjectStatus, szczegoly: SzczegolyProjektu) {
  const kamienie = szczegoly.kamienieGlowne;
  if (!kamienie.length) return -1;

  if (szczegoly.aktualnyKamienId) {
    const wskazany = kamienie.findIndex(kamien => kamien.id === szczegoly.aktualnyKamienId);
    if (wskazany >= 0) return wskazany;
  }

  const dokladny = kamienie.findIndex(kamien => kamien.status === status);
  if (dokladny >= 0) return dokladny;

  const indeksStatusu = linioweStatusyProjektu.indexOf(status);
  if (indeksStatusu >= 0) {
    let ostatni = -1;
    kamienie.forEach((kamien, indeks) => {
      const indeksKamienia = linioweStatusyProjektu.indexOf(kamien.status);
      if (indeksKamienia >= 0 && indeksKamienia <= indeksStatusu) ostatni = indeks;
    });
    if (ostatni >= 0) return ostatni;
  }

  return 0;
}

export function wyznaczStanyKamieni(status: ProjectStatus, szczegoly: SzczegolyProjektu): KamienZeStanem[] {
  const obecny = wyznaczIndeksAktualnegoKamienia(status, szczegoly);
  return szczegoly.kamienieGlowne.map((kamien, indeks) => ({
    ...kamien,
    stan: indeks < obecny ? 'ukonczony' : indeks === obecny ? 'obecny' : 'przyszly',
  }));
}

export function pobierzKamieniePosrednie(kamienGlowny: KamienMilowy, szczegoly: SzczegolyProjektu) {
  const pierwszyKamienDlaStatusu = szczegoly.kamienieGlowne.find(kamien => kamien.status === kamienGlowny.status);
  return (szczegoly.kamieniePosrednie ?? []).filter(kamien => {
    if (kamien.glownyKamienId) return kamien.glownyKamienId === kamienGlowny.id;
    return pierwszyKamienDlaStatusu?.id === kamienGlowny.id && kamien.status === kamienGlowny.status;
  });
}

export function pobierzWidocznePrzyszleEtapy(etapy: EtapPrzyszly[] = [], uprawnienia: UprawnieniaUzytkownika) {
  if (uprawnienia.widocznoscProjektu === 'guest') return [];
  if (uprawnienia.widocznoscProjektu === 'supporter' || uprawnienia.widocznoscProjektu === 'author' || uprawnienia.mozeEdytowacProjekt) {
    return etapy;
  }
  return etapy.filter(etap => etap.dostep === 'registered').slice(0, 2);
}
