import type { StatusDojrzalosci } from '../../data/projectDetails';

export type StanDojrzalosci = {
  wartosc: StatusDojrzalosci;
  sugestia: 'zastosowana' | 'odrzucona' | 'oczekujaca';
};

const dozwoloneDojrzalosci = new Set<StatusDojrzalosci>([
  'Koncepcja',
  'Wczesny prototyp',
  'Prototyp działający',
  'Wersja testowa',
  'Wersja użytkowa',
  'Wersja stabilna',
  'Wersja finalna',
]);
const dozwoloneStanySugestii = new Set<StanDojrzalosci['sugestia']>(['zastosowana', 'odrzucona', 'oczekujaca']);

export function kluczDojrzalosci(slug: string) {
  return `pk-project-maturity-v2:${slug}`;
}

export function pobierzStanDojrzalosci(slug: string, domyslna: StatusDojrzalosci, magazyn: Storage = localStorage): StanDojrzalosci {
  try {
    const zapis = magazyn.getItem(kluczDojrzalosci(slug));
    if (zapis) {
      const dane = JSON.parse(zapis) as Partial<StanDojrzalosci>;
      if (dozwoloneDojrzalosci.has(dane.wartosc as StatusDojrzalosci) && dozwoloneStanySugestii.has(dane.sugestia as StanDojrzalosci['sugestia'])) {
        return dane as StanDojrzalosci;
      }
    }

    const staryZapis = magazyn.getItem(`pk-dojrzalosc-${slug}`);
    if (staryZapis === 'zaakceptowana' || staryZapis === 'odrzucona') {
      const stan: StanDojrzalosci = { wartosc:domyslna, sugestia:staryZapis === 'zaakceptowana' ? 'zastosowana' : 'odrzucona' };
      magazyn.setItem(kluczDojrzalosci(slug), JSON.stringify(stan));
      return stan;
    }
  } catch {
    // Uszkodzony wpis nie może zablokować renderowania projektu.
  }
  return { wartosc:domyslna, sugestia:'oczekujaca' };
}

export function zapiszStanDojrzalosci(slug: string, stan: StanDojrzalosci, magazyn: Storage = localStorage) {
  magazyn.setItem(kluczDojrzalosci(slug), JSON.stringify(stan));
}
