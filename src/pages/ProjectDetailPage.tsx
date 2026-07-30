import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/siteData';
import { szczegolyProjektow } from '../data/projectDetails';
import { pobierzDostepneSekcje } from '../components/project/rejestrSekcjiProjektu';
import { RenderowaneSekcjeProjektu } from '../components/project/RenderowaneSekcjeProjektu';
import { SelektorRoli, useRolaWidza, wyznaczUprawnieniaTestowe } from '../components/project/RolaWidza';
import { StatusProjektu } from '../components/project/StatusProjektu';
import { kluczKolejnosciSekcji, kluczWyroznionychSekcji, pobierzKolejnoscSekcji, pobierzWyroznioneSekcje } from '../components/project/logikaSekcji';
import { useAutoryzacja } from '../moduly/auth/Autoryzacja';
import { wyznaczUprawnienia } from '../moduly/auth/uprawnienia';
import './ProjectDetailPage.css';
import '../components/project/InterakcjeProjektu.css';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const projekt = projects.find(element => element.slug === slug);
  const szczegoly = projekt ? szczegolyProjektow[projekt.slug] : undefined;
  const { uzytkownik, ladowanie } = useAutoryzacja();
  const uprawnieniaSesji = useMemo(() => wyznaczUprawnienia(uzytkownik), [uzytkownik]);
  const { rola, nadpisanie, ustawNadpisanie } = useRolaWidza(uprawnieniaSesji.widocznoscProjektu);
  const uprawnienia = useMemo(
    () => import.meta.env.DEV && nadpisanie ? wyznaczUprawnieniaTestowe(nadpisanie) : uprawnieniaSesji,
    [nadpisanie, uprawnieniaSesji],
  );
  const bazowe = useMemo(() => projekt ? pobierzDostepneSekcje({
    projekt,
    szczegoly,
    projectSlug:projekt.slug,
    uzytkownik,
    uprawnienia,
  }) : [], [projekt, szczegoly, uprawnienia, uzytkownik]);
  const identyfikatorySekcji = useMemo(() => bazowe.map(element => element.id), [bazowe]);
  const kluczDostepnychSekcji = identyfikatorySekcji.join('|');
  const [kolejnosc, ustawKolejnosc] = useState<string[]>([]);
  const [wyroznione, ustawWyroznione] = useState<string[]>([]);
  const [przeciagany, ustawPrzeciagany] = useState<string>();
  const [edycja, ustawEdycje] = useState(false);
  const [aktywna, ustawAktywna] = useState('');

  useEffect(() => {
    if (!projekt) return;
    const domyslnaKolejnosc = szczegoly?.kolejnoscSekcji ?? identyfikatorySekcji;
    ustawKolejnosc(pobierzKolejnoscSekcji(projekt.slug, identyfikatorySekcji, domyslnaKolejnosc));
    ustawWyroznione(pobierzWyroznioneSekcje(projekt.slug, identyfikatorySekcji, szczegoly?.wyroznioneSekcje ?? []));
  }, [identyfikatorySekcji, kluczDostepnychSekcji, projekt, szczegoly?.kolejnoscSekcji, szczegoly?.wyroznioneSekcje]);

  const sekcje = useMemo(() => {
    const mapa = new Map(bazowe.map(element => [element.id, element]));
    return [...kolejnosc, ...identyfikatorySekcji]
      .filter((id, indeks, lista) => lista.indexOf(id) === indeks)
      .map(id => mapa.get(id))
      .filter(Boolean) as typeof bazowe;
  }, [bazowe, identyfikatorySekcji, kolejnosc]);

  useEffect(() => {
    if (!sekcje.length || typeof IntersectionObserver === 'undefined') return;
    const obserwator = new IntersectionObserver(wpisy => {
      const wpis = wpisy.find(element => element.isIntersecting);
      if (wpis) ustawAktywna(wpis.target.id);
    }, { rootMargin:'-25% 0px -65% 0px' });
    sekcje.forEach(sekcja => {
      const element = document.getElementById(sekcja.id);
      if (element) obserwator.observe(element);
    });
    return () => obserwator.disconnect();
  }, [sekcje]);

  if (!projekt) return <div className="page-wrap inner-page"><h1>Nie znaleziono projektu</h1><Link to="/projekty">Wróć do projektów</Link></div>;
  if (ladowanie) return <div className="page-wrap inner-page"><p className="stan-ladowania-projektu" role="status">Sprawdzanie dostępu do projektu…</p></div>;
  if (projekt.locked && rola === 'guest') return <div className="page-wrap inner-page"><div className="locked-page"><h1>{projekt.title}</h1><p>Ten projekt jest widoczny tylko dla zalogowanych użytkowników.</p></div></div>;

  const zapiszKolejnosc = (nowa: string[]) => {
    ustawKolejnosc(nowa);
    localStorage.setItem(kluczKolejnosciSekcji(projekt.slug), JSON.stringify(nowa));
  };
  const przesun = (id: string, kierunek: -1 | 1) => {
    const indeks = kolejnosc.indexOf(id);
    if (indeks < 0) return;
    const docelowy = indeks + kierunek;
    if (docelowy < 0 || docelowy >= kolejnosc.length) return;
    const nowa = [...kolejnosc];
    [nowa[indeks], nowa[docelowy]] = [nowa[docelowy], nowa[indeks]];
    zapiszKolejnosc(nowa);
  };
  const upusc = (cel: string, pozycja: 'przed' | 'po') => {
    if (!przeciagany || przeciagany === cel) return;
    const nowa = kolejnosc.filter(id => id !== przeciagany);
    const indeksCelu = nowa.indexOf(cel);
    const indeksWstawienia = indeksCelu < 0 ? nowa.length : indeksCelu + (pozycja === 'po' ? 1 : 0);
    nowa.splice(indeksWstawienia, 0, przeciagany);
    zapiszKolejnosc(nowa);
    ustawPrzeciagany(undefined);
  };
  const zmienWyroznienie = (id: string) => {
    const nowe = wyroznione.includes(id) ? wyroznione.filter(element => element !== id) : [...wyroznione, id];
    ustawWyroznione(nowe);
    localStorage.setItem(kluczWyroznionychSekcji(projekt.slug), JSON.stringify(nowe));
  };

  return <div className={`page-wrap inner-page strona-projektu category-${projekt.category}`}>
    <SelektorRoli rolaSesji={uprawnieniaSesji.widocznoscProjektu} nadpisanie={nadpisanie} ustawNadpisanie={ustawNadpisanie}/>
    <header className="project-detail-hero">
      <div><span className="section-kicker">{projekt.eyebrow}</span><h1>{projekt.title}</h1><p>{projekt.description}</p>{szczegoly && <StatusProjektu key={projekt.slug} projekt={projekt} szczegoly={szczegoly} uprawnienia={uprawnienia}/>}</div>
      {projekt.image && <img src={projekt.image} alt=""/>}
    </header>
    {szczegoly && uprawnienia.mozeEdytowacProjekt && <button type="button" className="button secondary compact" aria-pressed={edycja} onClick={() => ustawEdycje(obecna => !obecna)}>{edycja ? 'Zakończ edycję układu' : 'Edytuj układ sekcji'}</button>}
    {sekcje.length > 0 && <nav className="nawigacja-sekcji-projektu" aria-label="Sekcje projektu">{sekcje.map(sekcja => <a key={sekcja.id} className={aktywna === sekcja.id ? 'aktywna' : ''} href={`#${sekcja.id}`} aria-current={aktywna === sekcja.id ? 'location' : undefined}>{sekcja.etykieta}</a>)}</nav>}
    <RenderowaneSekcjeProjektu sekcje={sekcje} wyroznione={wyroznione} trybEdycji={edycja && uprawnienia.mozeEdytowacProjekt} przesun={przesun} zmienWyroznienie={zmienWyroznienie} rozpocznijPrzeciaganie={ustawPrzeciagany} upusc={upusc}/>
  </div>;
}
