import { Link } from 'react-router-dom';
import { projects } from '../../data/siteData';
import { szczegolyProjektow, type SzczegolyProjektu } from '../../data/projectDetails';
import { czyBezpiecznyAdres } from './logikaMediow';
import { czyProjektMaSpolecznosc, pobierzRozwinieciaProjektu } from './logikaSpolecznosci';

export function WersjeProjektu({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  if (!szczegoly.wersje?.length) return null;
  return <div className="wersje-projektu">{szczegoly.wersje.map(wersja => <article key={`${wersja.nazwa}-${wersja.data}`}>
    <b>{wersja.nazwa}</b>
    <small>{wersja.data} · {wersja.dojrzalosc}</small>
    {wersja.zmiany.length > 0 && <div className="zmiany-wersji"><b>Zmiany w tej wersji</b><ul>{wersja.zmiany.map(zmiana => <li key={zmiana}>{zmiana}</li>)}</ul></div>}
    {wersja.changelogUrl && czyBezpiecznyAdres(wersja.changelogUrl) && <a className="text-link" href={wersja.changelogUrl} target="_blank" rel="noreferrer">Pełny changelog</a>}
  </article>)}</div>;
}

export function ProjektySpolecznosci({ szczegoly }: { szczegoly:SzczegolyProjektu }) {
  if (!czyProjektMaSpolecznosc(szczegoly)) return null;
  const relacja = szczegoly.relacja;
  const rozwiniecia = pobierzRozwinieciaProjektu(szczegoly.slug);
  const projektZrodlowy = relacja?.projektZrodlowySlug ? projects.find(projekt => projekt.slug === relacja.projektZrodlowySlug) : undefined;

  return <div className="projekty-spolecznosci">
    {projektZrodlowy && <p><b>{relacja?.typ}</b> projektu <Link className="text-link" to={`/projekty/${projektZrodlowy.slug}`}>{projektZrodlowy.title}</Link>.</p>}
    {rozwiniecia.length > 0 && <><h3>Powiązane projekty</h3>{rozwiniecia.map(projekt => {
      const typRelacji = szczegolyProjektow[projekt.slug]?.relacja?.typ;
      return <article key={projekt.slug}>
        {projekt.image && <img src={projekt.image} alt={`Logo projektu ${projekt.title}`}/>}
        <div><b>{projekt.title}</b><p>{projekt.description}</p><small>{projekt.status}{typRelacji ? ` · ${typRelacji}` : ''}</small><Link className="text-link" to={`/projekty/${projekt.slug}`}>Zobacz projekt</Link></div>
      </article>;
    })}</>}
  </div>;
}
