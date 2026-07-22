import { Link, useParams } from 'react-router-dom';
import { contentItems, etykietyTypowTresci } from '../data/siteData';

export function ContentDetailPage() {
  const { slug } = useParams();
  const material = contentItems.find(element => element.slug === slug && element.status === 'published');

  if (!material) return <div className="page-wrap inner-page"><div className="stan-wyszukiwania"><h1>Nie znaleziono publikacji</h1><p>Ten materiał nie jest dostępny publicznie.</p><Link to="/tresci">Wróć do treści</Link></div></div>;

  return <article className="page-wrap inner-page szczegoly-publikacji"><span className="section-kicker">{etykietyTypowTresci[material.type]}</span><h1>{material.title}</h1><p className="szczegoly-publikacji__meta">{material.meta}</p><p>To publiczna strona materiału. Pełna treść publikacji zostanie w przyszłości podłączona do źródła danych.</p><Link className="text-link" to="/tresci">Wróć do wszystkich treści</Link></article>;
}
