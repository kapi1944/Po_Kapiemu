import type { AktualizacjaProjektu, SzczegolyProjektu } from '../../data/projectDetails';
import { MediaProjektu } from './MediaProjektu';
import { czyBezpiecznyAdres } from './logikaMediow';

function DatyAktualizacji({ aktualizacja }: { aktualizacja:AktualizacjaProjektu }) {
  if (aktualizacja.dataWykonania && aktualizacja.dataPublikacji) {
    return <div className="aktualizacja-projektu__daty"><time dateTime={aktualizacja.dataWykonania}>Wykonano: {aktualizacja.dataWykonania}</time><time dateTime={aktualizacja.dataPublikacji}>Opublikowano: {aktualizacja.dataPublikacji}</time></div>;
  }
  const data = aktualizacja.dataPublikacji ?? aktualizacja.dataWykonania ?? aktualizacja.data;
  return data ? <time dateTime={data}>{data}</time> : null;
}

function nazwaZalacznika(adres: string) {
  try {
    const sciezka = new URL(adres, 'https://po-kapiemu.local').pathname;
    return decodeURIComponent(sciezka.split('/').filter(Boolean).at(-1) ?? 'Załącznik');
  } catch {
    return 'Załącznik';
  }
}

export function AktualizacjeProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  if (!szczegoly.aktualizacje?.length) return null;
  const kamienie = new Map([...szczegoly.kamienieGlowne, ...(szczegoly.kamieniePosrednie ?? [])].map(kamien => [kamien.id, kamien.tytul]));

  return <div className="projektowa-lista-aktualizacji">{szczegoly.aktualizacje.map(aktualizacja => {
    const zalaczniki = (aktualizacja.zalaczniki ?? []).filter(czyBezpiecznyAdres);
    const nazwaKamienia = aktualizacja.kamienMilowyId ? kamienie.get(aktualizacja.kamienMilowyId) : undefined;
    return <article key={aktualizacja.id}>
      <DatyAktualizacji aktualizacja={aktualizacja}/>
      {nazwaKamienia && <small className="aktualizacja-projektu__kamien">Etap: {nazwaKamienia}</small>}
      {aktualizacja.tytul && <h3>{aktualizacja.tytul}</h3>}
      <p>{aktualizacja.tresc}</p>
      {aktualizacja.zmiana && <p className="aktualizacja-projektu__zmiana"><b>Zmiana:</b> {aktualizacja.zmiana}</p>}
      <MediaProjektu media={aktualizacja.media} klasa="aktualizacja-projektu__media"/>
      {zalaczniki.length > 0 && <div className="aktualizacja-projektu__zalaczniki">{zalaczniki.map(adres => <a key={adres} href={adres} target="_blank" rel="noreferrer">{nazwaZalacznika(adres)}</a>)}</div>}
    </article>;
  })}</div>;
}
