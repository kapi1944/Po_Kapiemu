import { useMemo, useState } from 'react';
import { KomunikatFunkcji } from '../components/FeatureNotice';
import { porownanieAdapterowUsbCJack, kolumnyAdapterowUsbCJack } from '../moduly/porownania/daneAdapterowUsbCJack';
import { etykietyRekomendacjiProduktow, type AdapterUsbCJack, type ParametrZrodlowy, type WartoscPorownania, type WartoscTechniczna, type ZakresLiczbowy } from '../moduly/porownania/typyPorownan';

type Sortowanie = 'nazwa' | 'cena' | 'ocena' | 'moc';
type FiltrLogiczny = 'all' | 'yes' | 'no';

function jestZakresemLiczbowym(wartosc: WartoscTechniczna): wartosc is ZakresLiczbowy {
  return typeof wartosc === 'object' && 'min' in wartosc && 'max' in wartosc;
}

function jestParametremZrodlowym(wartosc: WartoscPorownania): wartosc is ParametrZrodlowy {
  return typeof wartosc === 'object' && wartosc !== null && ('producent' in wartosc || 'pomiarPoKapiemu' in wartosc || 'inne' in wartosc || 'powodBraku' in wartosc);
}

function formatujWartoscTechniczna(wartosc: WartoscTechniczna, jednostka?: string) {
  if (typeof wartosc === 'boolean') return <span className={wartosc ? 'wartosc-logiczna tak' : 'wartosc-logiczna nie'}>{wartosc ? 'Tak' : 'Nie'}</span>;
  if (jestZakresemLiczbowym(wartosc)) return `${wartosc.min}–${wartosc.max}${jednostka ? ` ${jednostka}` : ''}`;
  return `${wartosc}${jednostka ? ` ${jednostka}` : ''}`;
}

function pobierzPreferowanaWartosc<T extends WartoscTechniczna>(parametr: ParametrZrodlowy<T>) {
  return parametr.pomiarPoKapiemu?.wartosc ?? parametr.producent?.wartosc ?? parametr.inne?.[0]?.wartosc ?? null;
}

function formatujWartosc(wartosc: WartoscPorownania, jednostka?: string) {
  if (wartosc === null || wartosc === undefined || wartosc === '') return '—';
  if (!jestParametremZrodlowym(wartosc)) {
    if (typeof wartosc === 'boolean') return <span className={wartosc ? 'wartosc-logiczna tak' : 'wartosc-logiczna nie'}>{wartosc ? 'Tak' : 'Nie'}</span>;
    return wartosc;
  }

  const preferowana = pobierzPreferowanaWartosc(wartosc);
  if (preferowana === null) return <span title={wartosc.powodBraku ?? 'Brak danych'}>—</span>;

  const producent = wartosc.producent;
  const pomiar = wartosc.pomiarPoKapiemu;
  const roznica = producent && pomiar && JSON.stringify(producent.wartosc) !== JSON.stringify(pomiar.wartosc);
  const wybraneZrodlo = pomiar?.zrodlo ?? producent?.zrodlo ?? wartosc.inne?.[0]?.zrodlo;

  return <div>
    <div>{formatujWartoscTechniczna(preferowana, jednostka)}</div>
    {producent && pomiar
      ? <small>Producent: {formatujWartoscTechniczna(producent.wartosc, jednostka)} · Po Kapiemu: {formatujWartoscTechniczna(pomiar.wartosc, jednostka)}{roznica ? <strong> · Różnica</strong> : null}</small>
      : wybraneZrodlo ? <small>Źródło: {wybraneZrodlo.nazwa}</small> : null}
  </div>;
}

function pobierzLiczbe(parametr: ParametrZrodlowy<number>) {
  return pobierzPreferowanaWartosc(parametr);
}

function pobierzBoolean(parametr: ParametrZrodlowy<boolean>) {
  return pobierzPreferowanaWartosc(parametr);
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
  const [widoczneKolumny, ustawWidoczneKolumny] = useState<Set<string>>(() => new Set(kolumnyAdapterowUsbCJack.map(kolumna => kolumna.id)));
  const [wybraneProdukty, ustawWybraneProdukty] = useState<string[]>([]);
  const [tylkoWybrane, ustawTylkoWybrane] = useState(false);
  const [komunikatPorownania, ustawKomunikatPorownania] = useState('');

  const rekomendacje = produkty.flatMap(produkt => produkt.rekomendacje.zatwierdzonePrzezAutora.map(rekomendacja => ({ produkt, rekomendacja })));
  const produktyZDopasowaniem = produkty.filter(produkt => produkt.dlaKogo || produkt.dlaKogoNie);
  const dostepneTypy = [...new Set(produkty.map(produkt => produkt.typ))];
  const maMikrofon = produkty.some(produkt => pobierzBoolean(produkt.parametry.obslugaMikrofonu) !== null);
  const maMoc = produkty.some(produkt => pobierzLiczbe(produkt.parametry.mocPrzy32OmachMw) !== null);
  const maCene = produkty.some(produkt => produkt.cena !== null);
  const maAndroid = produkty.some(produkt => pobierzBoolean(produkt.parametry.android) !== null);
  const maWindows = produkty.some(produkt => pobierzBoolean(produkt.parametry.windows) !== null);
  const maPrzyciski = produkty.some(produkt => pobierzBoolean(produkt.parametry.przyciski) !== null);
  const maWiecejFiltrow = maAndroid || maWindows || maPrzyciski;
  const filtryAktywne = filtrTypu !== 'all' || filtrMikrofonu !== 'all' || minimalnaMoc !== '' || maksymalnaCena !== '' || filtrAndroida !== 'all' || filtrWindowsa !== 'all' || filtrPrzyciskow !== 'all' || sortowanie !== 'nazwa';
  const opcjonalneKolumny = kolumnyAdapterowUsbCJack.filter(kolumna => !kolumna.obowiazkowa);
  const aktywneKolumny = kolumnyAdapterowUsbCJack.filter(kolumna => kolumna.obowiazkowa || widoczneKolumny.has(kolumna.id));

  const przefiltrowaneProdukty = useMemo(() => {
    const minimum = Number(minimalnaMoc);
    const maksimum = Number(maksymalnaCena);
    return produkty.filter(produkt => {
      if (filtrTypu !== 'all' && produkt.typ !== filtrTypu) return false;
      if (filtrMikrofonu !== 'all' && pobierzBoolean(produkt.parametry.obslugaMikrofonu) !== (filtrMikrofonu === 'yes')) return false;
      const moc = pobierzLiczbe(produkt.parametry.mocPrzy32OmachMw);
      if (minimalnaMoc && (moc === null || moc < minimum)) return false;
      if (maksymalnaCena && (produkt.cena === null || produkt.cena.kwota > maksimum)) return false;
      if (filtrAndroida !== 'all' && pobierzBoolean(produkt.parametry.android) !== (filtrAndroida === 'yes')) return false;
      if (filtrWindowsa !== 'all' && pobierzBoolean(produkt.parametry.windows) !== (filtrWindowsa === 'yes')) return false;
      if (filtrPrzyciskow !== 'all' && pobierzBoolean(produkt.parametry.przyciski) !== (filtrPrzyciskow === 'yes')) return false;
      return true;
    }).sort((a, b) => {
      if (sortowanie === 'nazwa') return (a.producent + ' ' + a.model).localeCompare(b.producent + ' ' + b.model, 'pl');
      if (sortowanie === 'cena') return porownajWartosci(a.cena?.kwota ?? null, b.cena?.kwota ?? null, 'asc');
      if (sortowanie === 'ocena') return porownajWartosci(a.ocena, b.ocena, 'desc');
      return porownajWartosci(pobierzLiczbe(a.parametry.mocPrzy32OmachMw), pobierzLiczbe(b.parametry.mocPrzy32OmachMw), 'desc');
    });
  }, [filtrAndroida, filtrMikrofonu, filtrPrzyciskow, filtrTypu, filtrWindowsa, maksymalnaCena, minimalnaMoc, produkty, sortowanie]);

  const wynikoweProdukty = tylkoWybrane ? przefiltrowaneProdukty.filter(produkt => wybraneProdukty.includes(produkt.id)) : przefiltrowaneProdukty;

  const resetujFiltry = () => { ustawFiltrTypu('all'); ustawFiltrMikrofonu('all'); ustawMinimalnaMoc(''); ustawMaksymalnaCene(''); ustawFiltrAndroida('all'); ustawFiltrWindowsa('all'); ustawFiltrPrzyciskow('all'); ustawSortowanie('nazwa'); ustawWiecejFiltrow(false); };
  const przelaczKolumne = (id: string) => ustawWidoczneKolumny(obecne => { const nowe = new Set(obecne); if (nowe.has(id)) nowe.delete(id); else nowe.add(id); return nowe; });
  const przelaczProdukt = (id: string) => {
    ustawKomunikatPorownania('');
    if (wybraneProdukty.includes(id)) {
      const nowe = wybraneProdukty.filter(wybraneId => wybraneId !== id);
      ustawWybraneProdukty(nowe);
      if (nowe.length < 2) ustawTylkoWybrane(false);
      return;
    }
    if (wybraneProdukty.length >= 5) {
      ustawKomunikatPorownania('Możesz porównać maksymalnie 5 produktów jednocześnie.');
      return;
    }
    ustawWybraneProdukty([...wybraneProdukty, id]);
  };

  return <div className="page-wrap inner-page strona-porownania">
    <div className="page-hero"><span className="section-kicker">PORÓWNANIE</span><h1>{porownanie.nazwa}</h1><p>{porownanie.opis}</p><div className="metadane-porownania"><span>{produkty.length} {produkty.length === 1 ? 'produkt' : 'produkty'}</span>{porownanie.ostatniaAktualizacja && <span>Ostatnia aktualizacja: {porownanie.ostatniaAktualizacja}</span>}</div></div>

    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-rekomendacji"><h2 id="naglowek-rekomendacji">Rekomendacje</h2>{rekomendacje.length ? <div className="lista-rekomendacji">{rekomendacje.map(({ produkt, rekomendacja }) => <article key={produkt.id + rekomendacja}><span>{etykietyRekomendacjiProduktow[rekomendacja]}</span><b>{produkt.producent} {produkt.model}</b></article>)}</div> : <p>Publiczne rekomendacje pojawią się dopiero po zatwierdzeniu sugestii przez autora.</p>}</section>
    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-dopasowania"><h2 id="naglowek-dopasowania">Dla kogo / dla kogo nie</h2>{produktyZDopasowaniem.length ? <div className="lista-rekomendacji">{produktyZDopasowaniem.map(produkt => <article key={produkt.id}><b>{produkt.producent} {produkt.model}</b>{produkt.dlaKogo && <p><strong>Dla kogo:</strong> {produkt.dlaKogo}</p>}{produkt.dlaKogoNie && <p><strong>Dla kogo nie:</strong> {produkt.dlaKogoNie}</p>}</article>)}</div> : <p>Profile odbiorców pojawią się po ich zapisaniu przy produktach.</p>}</section>

    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-wyboru-produktow"><h2 id="naglowek-wyboru-produktow">Porównaj wybrane</h2><p>Wybierz od 2 do 5 produktów. Szósty produkt nie zostanie dodany.</p><div className="project-filters">{produkty.map(produkt => <button type="button" aria-pressed={wybraneProdukty.includes(produkt.id)} className={wybraneProdukty.includes(produkt.id) ? 'active' : ''} key={produkt.id} onClick={() => przelaczProdukt(produkt.id)}>{produkt.producent} {produkt.model}</button>)}</div><div className="narzedzia-porownania"><button type="button" className="button primary compact" disabled={wybraneProdukty.length < 2} onClick={() => ustawTylkoWybrane(true)}>Porównaj {wybraneProdukty.length} wybrane</button>{tylkoWybrane && <button type="button" className="button secondary compact" onClick={() => ustawTylkoWybrane(false)}>Pokaż wszystkie</button>}<span>{wybraneProdukty.length} / 5</span></div>{komunikatPorownania && <p role="status">{komunikatPorownania}</p>}</section>

    <section className="sekcja-rekomendacji" aria-labelledby="naglowek-kolumn"><h2 id="naglowek-kolumn">Widoczne kolumny</h2><p>Produkt i typ są zawsze widoczne. Pozostałe kolumny możesz włączać i wyłączać.</p><div className="project-filters">{opcjonalneKolumny.map(kolumna => <button type="button" aria-pressed={widoczneKolumny.has(kolumna.id)} className={widoczneKolumny.has(kolumna.id) ? 'active' : ''} key={kolumna.id} onClick={() => przelaczKolumne(kolumna.id)}>{kolumna.etykieta}</button>)}</div></section>

    <div className="narzedzia-porownania" aria-label="Filtry i sortowanie porównania"><label>Typ<select value={filtrTypu} onChange={zdarzenie => ustawFiltrTypu(zdarzenie.target.value as 'all' | AdapterUsbCJack['typ'])}><option value="all">Wszystkie</option>{dostepneTypy.map(typ => <option value={typ} key={typ}>{typ === 'dac' ? 'DAC' : 'Adapter'}</option>)}</select></label>{maMikrofon && <label>Mikrofon<select value={filtrMikrofonu} onChange={zdarzenie => ustawFiltrMikrofonu(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maMoc && <label>Min. moc przy 32 Ω<input type="number" min="0" value={minimalnaMoc} onChange={zdarzenie => ustawMinimalnaMoc(zdarzenie.target.value)}/></label>}{maCene && <label>Maks. cena<input type="number" min="0" value={maksymalnaCena} onChange={zdarzenie => ustawMaksymalnaCene(zdarzenie.target.value)}/></label>}<label>Sortuj<select value={sortowanie} onChange={zdarzenie => ustawSortowanie(zdarzenie.target.value as Sortowanie)}><option value="nazwa">Nazwa</option><option value="cena">Cena</option><option value="ocena">Ocena</option><option value="moc">Moc</option></select></label>{maWiecejFiltrow && <button type="button" className="button secondary compact" onClick={() => ustawWiecejFiltrow(obecny => !obecny)}>Więcej filtrów</button>}<button type="button" className="button secondary compact" disabled={!filtryAktywne} onClick={resetujFiltry}>Resetuj</button></div>
    {wiecejFiltrow && <div className="narzedzia-porownania narzedzia-porownania--wiecej">{maAndroid && <label>Android<select value={filtrAndroida} onChange={zdarzenie => ustawFiltrAndroida(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maWindows && <label>Windows<select value={filtrWindowsa} onChange={zdarzenie => ustawFiltrWindowsa(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}{maPrzyciski && <label>Przyciski<select value={filtrPrzyciskow} onChange={zdarzenie => ustawFiltrPrzyciskow(zdarzenie.target.value as FiltrLogiczny)}><option value="all">Wszystkie</option><option value="yes">Tak</option><option value="no">Nie</option></select></label>}</div>}
    <p className="liczba-wynikow">Widoczne produkty: {wynikoweProdukty.length} z {produkty.length}.{tylkoWybrane ? ' Tryb: tylko wybrane.' : ''}</p>
    <div className="tabela-porownania__przewijanie" tabIndex={0} aria-label="Tabela porównania produktów. Przewijaj poziomo, aby zobaczyć wszystkie parametry."><table className="tabela-porownania"><thead><tr>{aktywneKolumny.map((kolumna, indeks) => <th className={indeks === 0 ? 'tabela-porownania__produkt' : ''} scope="col" key={kolumna.id}>{kolumna.etykieta}</th>)}</tr></thead><tbody>{wynikoweProdukty.length ? wynikoweProdukty.map(produkt => <tr key={produkt.id}>{aktywneKolumny.map((kolumna, indeks) => <td className={indeks === 0 ? 'tabela-porownania__produkt' : ''} key={kolumna.id}>{formatujWartosc(kolumna.pobierzWartosc(produkt), kolumna.jednostka)}</td>)}</tr>) : <tr><td colSpan={aktywneKolumny.length}>Brak produktów spełniających wybrane kryteria.</td></tr>}</tbody></table></div>
    <section className="sekcja-kart-produktow" aria-labelledby="naglowek-kart-produktow"><div><span className="section-kicker">SZYBKI WYBÓR</span><h2 id="naglowek-kart-produktow">Produkty w porównaniu</h2></div><div className="lista-kart-produktow">{wynikoweProdukty.map(produkt => <article className="karta-produktu-porownania" key={produkt.id}><div className="karta-produktu-porownania__miniatura">{produkt.miniatura ? <img src={produkt.miniatura} alt=""/> : <span>Brak miniatury</span>}</div><div className="karta-produktu-porownania__tresc"><small>{produkt.producent}</small><h3>{produkt.model}</h3>{produkt.werdykt && <p>{produkt.werdykt}</p>}<div className="karta-produktu-porownania__metadane">{produkt.ocena !== null && <span>Ocena: {produkt.ocena} / 10</span>}{produkt.cena && <span>{produkt.cena.kwota} {produkt.cena.waluta}</span>}{produkt.rekomendacje.zatwierdzonePrzezAutora.map(rekomendacja => <strong key={rekomendacja}>{etykietyRekomendacjiProduktow[rekomendacja]}</strong>)}</div></div><KomunikatFunkcji klasaPrzycisku="button secondary compact" etykieta={'Informacja o szczegółach ' + produkt.producent + ' ' + produkt.model} tytul="Szczegóły produktu" opis="Osobna strona szczegółów produktu jest w przygotowaniu.">Zobacz szczegóły</KomunikatFunkcji></article>)}</div></section>
  </div>;
}
