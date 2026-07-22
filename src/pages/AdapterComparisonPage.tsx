import { porownanieAdapterowUsbCJack, kolumnyAdapterowUsbCJack } from '../moduly/porownania/daneAdapterowUsbCJack';
import type { WartoscPorownania } from '../moduly/porownania/typyPorownan';

function formatujWartosc(wartosc: WartoscPorownania) {
  if (wartosc === null || wartosc === undefined || wartosc === '') return '—';
  if (typeof wartosc === 'boolean') return <span className={wartosc ? 'wartosc-logiczna tak' : 'wartosc-logiczna nie'}>{wartosc ? 'Tak' : 'Nie'}</span>;
  return wartosc;
}

export function AdapterComparisonPage() {
  const porownanie = porownanieAdapterowUsbCJack;
  const liczbaProduktow = porownanie.produkty.length;

  return <div className="page-wrap inner-page strona-porownania">
    <div className="page-hero"><span className="section-kicker">PORÓWNANIE</span><h1>{porownanie.nazwa}</h1><p>{porownanie.opis}</p><div className="metadane-porownania"><span>{liczbaProduktow} {liczbaProduktow === 1 ? 'produkt' : 'produkty'}</span>{porownanie.ostatniaAktualizacja && <span>Ostatnia aktualizacja: {porownanie.ostatniaAktualizacja}</span>}</div></div>
    <div className="tabela-porownania__przewijanie" tabIndex={0} aria-label="Tabela porównania produktów. Przewijaj poziomo, aby zobaczyć wszystkie parametry."><table className="tabela-porownania"><thead><tr>{kolumnyAdapterowUsbCJack.map((kolumna, indeks) => <th className={indeks === 0 ? 'tabela-porownania__produkt' : ''} scope="col" key={kolumna.id}>{kolumna.etykieta}</th>)}</tr></thead><tbody>{porownanie.produkty.map(produkt => <tr key={produkt.id}>{kolumnyAdapterowUsbCJack.map((kolumna, indeks) => <td className={indeks === 0 ? 'tabela-porownania__produkt' : ''} key={kolumna.id}>{formatujWartosc(kolumna.pobierzWartosc(produkt))}</td>)}</tr>)}</tbody></table></div>
  </div>;
}
