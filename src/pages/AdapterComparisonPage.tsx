import { useMemo, useState } from 'react';
import { KomunikatFunkcji } from '../components/FeatureNotice';
import { porownanieAdapterowUsbCJack, kolumnyAdapterowUsbCJack } from '../moduly/porownania/daneAdapterowUsbCJack';
import { etykietyRekomendacjiProduktow, type AdapterUsbCJack, type WartoscPorownania } from '../moduly/porownania/typyPorownan';

type Sortowanie = 'nazwa' | 'cena' | 'ocena' | 'moc';
type FiltrLogiczny = 'all' | 'yes' | 'no';

function formatujWartosc(wartosc: WartoscPorownania) {
  if (wartosc === null || wartosc === undefined || wartosc === '') return '—';
  if (typeof wartosc === 'boolean') return <span className={wartosc ? 'wartosc-logiczna tak' : 'wartosc-logiczna nie'}>{wartosc ? 'Tak' : 'Nie'}</span>;
  return wartosc;
}
function pobierzWartoscLiczbowa(wartosc: string | null) {
  const dopasowanie = wartosc?.replace(',', '.').match(/[0-9]+(?:\.[0-9]+)?/);
  return dopasowanie ? Number(dopasowanie[0]) : null;
}
function porownajWartosci(a: number | null, b: number | null, kierunek: 'asc' | 'desc') {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  return kierunek === 'asc' ? a - b : b - a;
}

export function AdapterComparisonPage() {
  const porownanie = porownanieAdapterowUsbCJack;
  const produkty = porownanie.produkty;
  const [filtrTypu, ustawFiltrTypu] = useState<'all' | AdapterUsbCJack['typ']>('all');
  const [filtrMikrofonu, ustawFiltrMikrofonu] = useState<FiltrLogiczny>('all');
  const [minimalnaMoc, ustawMinimalnaMoc] = useState('');
  const [maksymalnaCena, ustawMaksymalnaCene] = useState('');
  const [wiecejFiltrow, ustawWiecejFiltrow] = useState(false);
  const [filtrAndroida, ustawFiltrAndroida] = useState<FiltrLogiczny>('all');
  const [filtrWindowsa, ustawFiltrWindowsa] = useState<FiltrLogiczny>('all');
  const [filtrPrzyciskow, ustawFiltrPrzyciskow] = useState<FiltrLogiczny>('all');
  const [sortowanie, ustawSortowanie] = useState<Sortowanie>('nazwa');
  const rekomendacje = produkty.flatMap(produkt => produkt.rekomendacje.map(rekomendacja => ({ produkt, rekomendacja })));
  const produktyZDopasowaniem = produkty.filter(produkt => produkt.dlaKogo || produkt.dlaKogoNie);
  const dostepneTypy = [...new Set(produkty.map(produkt => produkt.typ))];
  const maMikrofon = produkty.some(produkt => produkt.parametry.obslugaMikrofonu !== null);
  const maMoc = produkty.some(produkt => pobierzWartoscLiczbowa(produkt.parametry.mocPrzy32Omach) !== null);
  const maCene = produkty.some(produkt => produkt.cena !== null);
  const maAndroid = produkty.some(produkt => produkt.parametry.android !== null);
  const maWindows = produkty.some(produkt => produkt.parametry.windows !== null);
  const maPrzyciski = produkty.some(produkt => produkt.parametry.przyciski !== null);
  const maWiecejFiltrow = maAndroid || maWindows || maPrzyciski;
  const filtryAktywne = filtrTypu !== 'all' || filtrMikrofonu !== 'all' || minimalnaMoc !== '' || maksymalnaCena !== '' || filtrAndroida !== 'all' || filtrWindowsa !== 'all' || filtrPrzyciskow !== 'all' || sortowanie !== 'nazwa';
  const wynikoweProdukty = useMemo(() => {
    const minimum = Number(minimalnaMoc);
    const maksimum = Number(maksymalnaCena);
    return produkty.filter(produkt => {
      if (filtrTypu !== 'all' && produkt.typ !== filtrTypu) return false;
      if (filtrMikrofonu !== 'all' && produkt.parametry.obslugaMikrofonu !== (filtrMikrofonu === 'yes')) return false;
      const moc = pobierzWartoscLiczbowa(produkt.parametry.mocPrzy32Omach);
      if (minimalnaMoc && (moc === null || moc < minimum)) return false;
      if (maksymalnaCena && (produkt.cena === null || produkt.cena.kwota > maksimum)) return false;
      if (filtrAndroida !== 'all' && produkt.parametry.android !== (filtrAndroida === 'yes')) return false;
      if (filtrWindowsa !== 'all' && produkt.parametry.windows !== (filtrWindowsa === 'yes')) return false;
      if (filtrPrzyciskow !== 'all' && produkt.parametry.przyciski !== (filtrPrzyciskow === 'yes')) return false;
      return true;
    }).sort((a, b) => {
      if (sortowanie === 'nazwa') return (a.producent + ' ' + a.model).localeCompare(b.producent + ' ' + b.model, 'pl');
      if (sortowanie === 'cena') return porownajWartosci(a.cena?.kwota ?? null, b.cena?.kwota ?? null, 'asc');
      if (sortowanie === 'ocena') return porownajWartosci(a.ocena, b.ocena, 'desc');
      return porownajWartosci(pobierzWartoscLiczbowa(a.parametry.mocPrzy32Omach), pobierzWartoscLiczbowa(b.parametry.mocPrzy32Omach), 'desc');
    });
  }, [filtrAndroida, filtrMikrofonu, filtrPrzyciskow, filtrTypu, filtrWindowsa, maksymalnaCena, minimalnaMoc, produkty, sortowanie]);
  const resetujFiltry = () => { ustawFiltrTypu('all'); ustawFiltrMikrofonu('all'); ustawMinimalnaMoc(''); ustawMaksymalnaCene(''); ustawFiltrAndroida('all'); ustawFiltrWindowsa('all'); ustawFiltrPrzyciskow('all'); ustawSortowanie('nazwa'); ustawWiecejFiltrow(false); };
  return <div className="page-wrap inner-page strona-porownania">
    <div className="page-hero"><span className="section-kicker">PORÓWNANIE</span><h1>{porownanie.nazwa}</h1><p>{porownanie.opis}</p><div className="metadane-porownania"><span>{produkty.length} {produkty.length === 1 ? 'produkt' : 'produkty'}</span>{porownanie.ostatniaAktualizacja && <span>Ostatnia aktualizacja: {porownanie.ostatniaAktualizacja}</span>}</div></div>
    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-rekomendacji"><h2 id="naglowek-rekomendacji">Rekomendacje</h2>{rekomendacje.length ? <div className="lista-rekomendacji">{rekomendacje.map(({ produkt, rekomendacja }) => <article key={produkt.id + rekomendacja}><span>{etykietyRekomendacjiProduktow[rekomendacja]}</span><b>{produkt.producent} {produkt.model}</b></article>)}</div> : <p>Rekomendacje pojawią się po ich zapisaniu przy produktach.</p>}</section>
    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-dopasowania"><h2 id="naglowek-dopasowania">Dla kogo / dla kogo nie</h2>{produktyZDopasowaniem.length ? <div className="lista-rekomendacji">{produktyZDopasowaniem.map(produkt => <article key={produkt.id}><b>{produkt.producent} {produkt.model}</b>{produkt.dlaKogo && <p><strong>Dla kogo:</strong> {produkt.dlaKogo}</p>}{produkt.dlaKogoNie && <p><strong>Dla kogo nie:</strong> {produkt.dlaKogoNie}</p>}</article>)}</div> : <p>Profile odbiorców pojawią się po ich zapisaniu przy produktach.</p>}</section>
    <div className="narzedzia-porownania" aria-label="Filtry i sortowanie porównania"><label>Typ<select value={filtrTypu} onChange={zdarzenie => ustawFiltrTypu(zdarzenie.target.value as 'all' | AdapterUsbCJack['typ'])}><option value="all">Wszystkie</option>{dostepneTypy.map(typ => <option value={typ} key={typ}>{typ === 'dac' ? 'DAC' : 'Adapter'}</option>)}</select></label>{maMikrofon && <label>Mikrofon<select value={filtrMikrofonu} onChange={zdarzenie => ustawFiltrMikrofonu(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maMoc && <label>Min. moc przy 32 Ω<input type="number" min="0" value={minimalnaMoc} onChange={zdarzenie => ustawMinimalnaMoc(zdarzenie.target.value)}/></label>}{maCene && <label>Maks. cena<input type="number" min="0" value={maksymalnaCena} onChange={zdarzenie => ustawMaksymalnaCene(zdarzenie.target.value)}/></label>}<label>Sortuj<select value={sortowanie} onChange={zdarzenie => ustawSortowanie(zdarzenie.target.value as Sortowanie)}><option value="nazwa">Nazwa</option><option value="cena">Cena</option><option value="ocena">Ocena</option><option value="moc">Moc</option></select></label>{maWiecejFiltrow && <button type="button" className="button secondary compact" onClick={() => ustawWiecejFiltrow(obecny => !obecny)}>Więcej filtrów</button>}<button type="button" className="button secondary compact" disabled={!filtryAktywne} onClick={resetujFiltry}>Resetuj</button></div>
    {wiecejFiltrow && <div className="narzedzia-porownania narzedzia-porownania--wiecej">{maAndroid && <label>Android<select value={filtrAndroida} onChange={zdarzenie => ustawFiltrAndroida(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maWindows && <label>Windows<select value={filtrWindowsa} onChange={zdarzenie => ustawFiltrWindowsa(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maPrzyciski && <label>Przyciski<select value={filtrPrzyciskow} onChange={zdarzenie => ustawFiltrPrzyciskow(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}</div>}
    <p className="liczba-wynikow">Widoczne produkty: {wynikoweProdukty.length} z {produkty.length}.</p>
    <div className="tabela-porownania__przewijanie" tabIndex={0} aria-label="Tabela porównania produktów. Przewijaj poziomo, aby zobaczyć wszystkie parametry."><table className="tabela-porownania"><thead><tr>{kolumnyAdapterowUsbCJack.map((kolumna, indeks) => <th className={indeks === 0 ? 'tabela-porownania__produkt' : ''} scope="col" key={kolumna.id}>{kolumna.etykieta}</th>)}</tr></thead><tbody>{wynikoweProdukty.length ? wynikoweProdukty.map(produkt => <tr key={produkt.id}>{kolumnyAdapterowUsbCJack.map((kolumna, indeks) => <td className={indeks === 0 ? 'tabela-porownania__produkt' : ''} key={kolumna.id}>{formatujWartosc(kolumna.pobierzWartosc(produkt))}</td>)}</tr>) : <tr><td colSpan={kolumnyAdapterowUsbCJack.length}>Brak produktów spełniających wybrane kryteria.</td></tr>}</tbody></table></div>
    <section className="sekcja-kart-produktow" aria-labelledby="naglowek-kart-produktow"><div><span className="section-kicker">SZYBKI WYBÓR</span><h2 id="naglowek-kart-produktow">Produkty w porównaniu</h2></div><div className="lista-kart-produktow">{wynikoweProdukty.map(produkt => <article className="karta-produktu-porownania" key={produkt.id}><div className="karta-produktu-porownania__miniatura">{produkt.miniatura ? <img src={produkt.miniatura} alt=""/> : <span>Brak miniatury</span>}</div><div className="karta-produktu-porownania__tresc"><small>{produkt.producent}</small><h3>{produkt.model}</h3>{produkt.werdykt && <p>{produkt.werdykt}</p>}<div className="karta-produktu-porownania__metadane">{produkt.ocena !== null && <span>Ocena: {produkt.ocena} / 10</span>}{produkt.cena && <span>{produkt.cena.kwota} {produkt.cena.waluta}</span>}{produkt.rekomendacje.map(rekomendacja => <strong key={rekomendacja}>{etykietyRekomendacjiProduktow[rekomendacja]}</strong>)}</div></div><KomunikatFunkcji klasaPrzycisku="button secondary compact" etykieta={'Informacja o szczegółach ' + produkt.producent + ' ' + produkt.model} tytul="Szczegóły produktu" opis="Osobna strona szczegółów produktu jest w przygotowaniu.">Zobacz szczegóły</KomunikatFunkcji></article>)}</div></section>
  </div>;
}
