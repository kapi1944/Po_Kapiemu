import { Link, useParams } from 'react-router-dom';
import { etykietyTypowMaterialowRecenzenckich, reviews } from '../data/siteData';

export function ReviewDetailPage() {
  const { slug } = useParams();
  const material = reviews.find(element => element.slug === slug && element.status === 'published');

  if (!material) return <div className="page-wrap inner-page"><div className="stan-wyszukiwania"><h1>Nie znaleziono publikacji</h1><p>Ten materiał nie jest dostępny publicznie.</p><Link to="/recenzje">Wróć do recenzji</Link></div></div>;

  return <article className="page-wrap inner-page szczegoly-publikacji"><span className="section-kicker">{etykietyTypowMaterialowRecenzenckich[material.typ]}</span><h1>{material.title}</h1><p className="szczegoly-publikacji__meta">{material.author} · {material.date} · Ocena: {material.score} / 10</p><p>{material.verdict}</p><Link className="text-link" to="/recenzje">Wróć do recenzji, testów i porównań</Link></article>;
}
