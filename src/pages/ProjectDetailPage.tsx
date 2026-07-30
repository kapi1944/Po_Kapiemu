import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/siteData';
import { szczegolyProjektow } from '../data/projectDetails';
import { pobierzDostepneSekcje, RenderowaneSekcjeProjektu } from '../components/project/rejestrSekcjiProjektu';
import { SelektorRoli, useRolaWidza } from '../components/project/RolaWidza';
import { StatusProjektu, SugestiaDojrzalosci } from '../components/project/StatusProjektu';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const projekt = projects.find(element => element.slug === slug);
  const szczegoly = projekt ? szczegolyProjektow[projekt.slug] : undefined;
  const { rola, ustawRole } = useRolaWidza();
  const sekcje = useMemo(() => projekt ? pobierzDostepneSekcje(projekt, szczegoly, rola) : [], [projekt, szczegoly, rola]);
  const [aktywnaSekcja, ustawAktywnaSekcje] = useState(sekcje[0]?.id ?? '');
  const [sugestiaAktywna, ustawSugestieAktywna] = useState(true);
  useEffect(() => {
    if (!sekcje.length) return;
    const obserwator = new IntersectionObserver(wpisy => { const widoczna = wpisy.find(wpis => wpis.isIntersecting); if (widoczna) ustawAktywnaSekcje(widoczna.target.id); }, { rootMargin:'-25% 0px -65% 0px' });
    sekcje.forEach(sekcja => { const element = document.getElementById(sekcja.id); if (element) obserwator.observe(element); });
    return () => obserwator.disconnect();
  }, [sekcje]);
  if (!projekt) return <div className="page-wrap inner-page"><h1>Nie znaleziono projektu</h1><Link to="/projekty">Wróć do projektów</Link></div>;
  if (projekt.locked) return <div className="page-wrap inner-page"><div className="locked-page"><h1>{projekt.title}</h1><p>Ten projekt jest widoczny tylko dla zalogowanych użytkowników.</p><Link className="button secondary" to="/projekty">Wróć do projektów</Link></div></div>;
  return <div className={`page-wrap inner-page strona-projektu category-${projekt.category}`}>
    <SelektorRoli rola={rola} ustawRole={ustawRole}/>
    <header className="project-detail-hero"><div><span className="section-kicker">{projekt.eyebrow}</span><h1>{projekt.title}</h1><p>{projekt.description}</p>{szczegoly && <StatusProjektu status={projekt.status} szczegoly={szczegoly} rola={rola}/>}</div>{projekt.image && <img src={projekt.image} alt=""/>}</header>
    {szczegoly && rola === 'author' && <SugestiaDojrzalosci szczegoly={szczegoly} aktywna={sugestiaAktywna} onZastosuj={() => { localStorage.setItem(`pk-dojrzalosc-${projekt.slug}`, 'zaakceptowana'); ustawSugestieAktywna(false); }} onOdrzuc={() => { localStorage.setItem(`pk-dojrzalosc-${projekt.slug}`, 'odrzucona'); ustawSugestieAktywna(false); }}/>}
    {sekcje.length > 0 && <nav className="nawigacja-sekcji-projektu" aria-label="Sekcje projektu">{sekcje.map(sekcja => <a key={sekcja.id} className={aktywnaSekcja === sekcja.id ? 'aktywna' : ''} href={`#${sekcja.id}`} aria-current={aktywnaSekcja === sekcja.id ? 'location' : undefined}>{sekcja.etykieta}</a>)}</nav>}
    <RenderowaneSekcjeProjektu sekcje={sekcje} wyroznione={szczegoly?.wyroznioneSekcje}/>
  </div>;
}