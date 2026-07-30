import type { RolaWidza } from '../../data/projectDetails';

const role: RolaWidza[] = ['guest', 'registered', 'supporter', 'author'];
const etykiety: Record<RolaWidza, string> = {
  guest:'Gość',
  registered:'Zalogowany',
  supporter:'Wspierający',
  author:'Autor',
};

export function SelektorRoli({ rolaSesji, nadpisanie, ustawNadpisanie }: {
  rolaSesji: RolaWidza;
  nadpisanie: RolaWidza | null;
  ustawNadpisanie: (rola: RolaWidza | null) => void;
}) {
  if (!import.meta.env.DEV) return null;
  return <label className="selektor-roli">Rola demonstracyjna
    <select value={nadpisanie ?? ''} onChange={zdarzenie => ustawNadpisanie(zdarzenie.target.value ? zdarzenie.target.value as RolaWidza : null)}>
      <option value="">Sesja ({etykiety[rolaSesji]})</option>
      {role.map(wartosc => <option key={wartosc} value={wartosc}>{etykiety[wartosc]}</option>)}
    </select>
  </label>;
}
