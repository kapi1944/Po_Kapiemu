import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/siteData';
import { Icon } from '../components/Icons';
import { KomunikatFunkcji } from '../components/FeatureNotice';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const projekt = projects.find(element => element.slug === slug);
  if (!projekt) return <div className="page-wrap inner-page"><h1>Nie znaleziono projektu</h1><Link to="/projekty">Wróć do projektów</Link></div>;
  if (projekt.locked) return <div className="page-wrap inner-page"><div className="locked-page"><Icon name="lock" size={42}/><span className="section-kicker">PROJEKT ZABLOKOWANY</span><h1>{projekt.title}</h1><p>Ten projekt jest widoczny tylko dla zalogowanych użytkowników. Logowanie zostanie dodane w kolejnym etapie.</p><Link className="button secondary" to="/projekty">Wróć do projektów</Link></div></div>;

  return <div className="page-wrap inner-page">
    <div className={`project-detail-hero category-${projekt.category}`}><div><span className="section-kicker">{projekt.eyebrow}</span><h1>{projekt.title}</h1><p>{projekt.description}</p><div className="project-meta-row"><span>{projekt.status}</span><b>{projekt.progress}% ukończone</b></div><div className="progress-track large"><span style={{width:`${projekt.progress}%`}}/></div></div><div className="project-big-symbol">{projekt.title.slice(0,2).toUpperCase()}</div></div>
    <div className="detail-grid"><section className="detail-card"><span className="section-kicker">NAJWAŻNIEJSZE</span><h2>Co już jest w projekcie?</h2><ul className="feature-list">{projekt.highlights.map(element => <li key={element}><span>✓</span>{element}</li>)}</ul></section><section className="detail-card"><span className="section-kicker">AKTUALIZACJE</span><h2>Ostatnie zmiany</h2><div className="timeline-item"><b>{projekt.lastUpdated}</b><p>Przygotowano publiczną prezentację projektu na stronie Po Kapiemu.</p></div><div className="timeline-item"><b>Poprzednio</b><p>Rozwój funkcji i porządkowanie podstawowego workflow.</p></div></section><section className="detail-card"><span className="section-kicker">GŁOSOWANIA</span><h2>Decyzje społeczności</h2><p>Tu pojawią się głosowania związane bezpośrednio z projektem.</p><KomunikatFunkcji klasaPrzycisku="button secondary compact" etykieta="Informacja o głosowaniach projektu" tytul="Głosowania projektu" opis="Głosowania przypisane do projektów są w przygotowaniu. Pozwolą społeczności pomagać w decyzjach dotyczących tego projektu.">Brak aktywnych głosowań</KomunikatFunkcji></section><section className="detail-card"><span className="section-kicker">MATERIAŁY</span><h2>Pliki i publikacje</h2><p>Dokumentacja, materiały do pobrania oraz filmy powiązane z projektem.</p><Link className="text-link" to="/tresci">Przejdź do treści <Icon name="arrow" size={15}/></Link></section></div>
  </div>;
}
