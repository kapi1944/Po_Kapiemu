import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/siteData';
import { szczegolyProjektow } from '../data/projectDetails';
import { pobierzDostepneSekcje, RenderowaneSekcjeProjektu } from '../components/project/rejestrSekcjiProjektu';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const projekt = projects.find(element => element.slug === slug);
  const szczegoly = projekt ? szczegolyProjektow[projekt.slug] : undefined;
  const sekcje = projekt ? pobierzDostepneSekcje(projekt, szczegoly) : [];
  const [aktywnaSekcja, ustawAktywnaSekcje] = useState(sekcje[0]?.id ?? '');
  useEffect(() => {
    if (!sekcje.length) return;
    const obserwator = new IntersectionObserver(wpisy => { const widoczna = wpisy.find(wpis => wpis.isIntersecting); if (widoczna) ustawAktywnaSekcje(widoczna.target.id); }, { rootMargin:'-25% 0px -65% 0px' });
    sekcje.forEach(sekcja => { const element = document.getElementById(sekcja.id); if (element) obserwator.observe(element); });
    return () => obserwator.disconnect();
  }, [sekcje]);
  if (!projekt) return <div className="page-wrap inner-page"><h1>Nie znaleziono projektu</h1><Link to="/projekty">Wróć do projektów</Link></div>;
  if (projekt.locked) return <div className="page-wrap inner-page"><div className="locked-page"><h1>{projekt.title}</h1><p>Ten projekt jest widoczny tylko dla zalogowanych użytkowników.</p><Link className="button secondary" to="/projekty">Wróć do projektów</Link></div></div>;
  return <div className={`page-wrap inner-page strona-projektu category-${projekt.category}`}>
    <header className="project-detail-hero"><div><span className="section-kicker">{projekt.eyebrow}</span><h1>{projekt.title}</h1><p>{projekt.description}</p></div>{projekt.image && <img src={projekt.image} alt=""/>}</header>
    {sekcje.length > 0 && <nav className="nawigacja-sekcji-projektu" aria-label="Sekcje projektu">{sekcje.map(sekcja => <a key={sekcja.id} className={aktywnaSekcja === sekcja.id ? 'aktywna' : ''} href={`#${sekcja.id}`} aria-current={aktywnaSekcja === sekcja.id ? 'location' : undefined}>{sekcja.etykieta}</a>)}</nav>}
    <RenderowaneSekcjeProjektu sekcje={sekcje} wyroznione={szczegoly?.wyroznioneSekcje}/>
  </div>;
}