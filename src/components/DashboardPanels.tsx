import { Link } from 'react-router-dom';
import { contentItems, poll, reviews } from '../data/siteData';
import { Icon } from './Icons';

const aktywnosci = [
  { ikona:'projects', kolor:'technical', tresc:<><b>Asystent BUR</b> otrzymał nowy import harmonogramów.</>, czas:'12 min temu' },
  { ikona:'vote', kolor:'music', tresc:<>Wystartowało głosowanie o kolejny materiał.</>, czas:'38 min temu' },
  { ikona:'reviews', kolor:'blocks', tresc:<>Nowa recenzja: <b>FiiO KA11</b> jest gotowa.</>, czas:'Dzisiaj, 09:24' },
] as const;

export function PanelPodsumowania() {
  return <section className="summary-layout" aria-label="Szybki przegląd i status ogólny">
    <div className="summary-grid"><article className="summary-card technical"><Icon name="projects" size={19}/><div><b>3</b><span>Aktywne projekty</span></div><small>+1 w tym miesiącu</small></article><article className="summary-card music"><Icon name="vote" size={19}/><div><b>1</b><span>Aktywne głosowania</span></div><small>100 oddanych głosów</small></article><article className="summary-card blocks"><Icon name="activity" size={19}/><div><b>4</b><span>Nowe aktywności</span></div><small>Od ostatniej wizyty</small></article><article className="summary-card experimental"><Icon name="content" size={19}/><div><b>3</b><span>Do publikacji</span></div><small>Materiały w kolejce</small></article></div>
    <article className="overall-status"><div className="status-ring"><div className="status-ring-content"><strong>13</strong><span>projektów łącznie</span></div></div><div className="status-legend"><h2>Status ogólny</h2><ul><li><i style={{background:'var(--technical)'}}/><span>W realizacji</span><b>6</b></li><li><i style={{background:'var(--blocks)'}}/><span>W planach</span><b>3</b></li><li><i style={{background:'var(--experimental)'}}/><span>Zakończone</span><b>2</b></li><li><i style={{background:'var(--muted)'}}/><span>Wstrzymane</span><b>2</b></li></ul></div></article>
  </section>;
}

export function FeedAktywnosci() {
  return <section className="activity-panel" aria-labelledby="naglowek-aktywnosci"><div className="compact-heading"><div><span className="section-kicker">NA ŻYWO</span><h2 id="naglowek-aktywnosci">Teraz się dzieje</h2></div><Link className="text-link" to="/tresci">Cały feed <Icon name="arrow" size={15}/></Link></div><div className="activity-list">{aktywnosci.map(({ikona,kolor,tresc,czas}) => <div key={czas}><span className={`activity-icon ${kolor}`}><Icon name={ikona} size={15}/></span><p>{tresc}<small>{czas}</small></p></div>)}</div></section>;
}

export function KartaGlosowania() {
  const liczbaGlosow = poll.options.reduce((suma, opcja) => suma + opcja.votes, 0);
  return <section className="poll-card feature-card" aria-labelledby="naglowek-glosowania"><div className="card-topline"><span className="tag hot">AKTYWNE GŁOSOWANIE</span><span className="binding">Niewiążące</span></div><h2 id="naglowek-glosowania">{poll.question}</h2><p>Wybór społeczności pomaga ustalić kolejność pracy.</p><div className="poll-options">{poll.options.map((opcja, indeks) => { const procent = Math.round(opcja.votes / liczbaGlosow * 100); return <button className={`poll-result category-${opcja.category}`} key={opcja.label}><span className="poll-result-head"><span className="poll-letter">{String.fromCharCode(65 + indeks)}</span><span>{opcja.label}</span><b>{procent}%</b></span><span className="poll-result-track"><span style={{width:`${procent}%`}}/></span></button>; })}</div><div className="poll-footer"><span>{liczbaGlosow} głosów</span><Link to="/glosowania">Zagłosuj <Icon name="arrow" size={15}/></Link></div></section>;
}

export function ModulyDashboardu() {
  return <section className="dashboard-modules" aria-label="Dodatkowe moduły dashboardu">
    <article className="collaboration-card"><div><span className="section-kicker">WSPÓŁPRACA</span><h2>Zróbmy coś dobrego razem.</h2><p>Jasne zasady, praktyczne formaty i projekty pasujące do Po Kapiemu.</p><div className="collaboration-chips"><span>Sprzęt do testów</span><span>Sponsoring</span><span>Afiliacja</span><span>Wspólny projekt</span></div></div><Link className="button secondary compact" to="/wspolpraca">Napisz w sprawie współpracy <Icon name="arrow" size={15}/></Link></article>
    <article className="categories-card"><span className="section-kicker">KATEGORIE</span><h2>Szybki skrót</h2><div className="category-list"><Link className="technical" to="/kategorie#techniczne">Techniczne</Link><Link className="music" to="/kategorie#muzyczne">Muzyczne</Link><Link className="blocks" to="/kategorie#klockowe">Klockowe</Link><Link className="experimental" to="/kategorie#eksperymentalne">Eksperymentalne</Link></div></article>
    <article className="reminders-card"><div className="compact-heading"><div><span className="section-kicker">NADCHODZI</span><h2>Kolejna publikacja</h2></div></div><ul><li><i/><span>Kulisy budowy VidEdit Studio</span><small>Piątek · 18:00</small></li></ul><p className="reminders-login"><Icon name="lock" size={12}/> Pełna lista przypomnień będzie dostępna po zalogowaniu.</p></article>
  </section>;
}

export function SekcjaPublikacji() {
  return <section className="section-block"><div className="section-head"><div><span className="section-kicker">NOWE</span><h2>Ostatnio opublikowane</h2><p>Filmy, aktualizacje, artykuły i materiały do pobrania.</p></div><Link className="text-link desktop-link" to="/tresci">Wszystkie treści <Icon name="arrow" size={16}/></Link></div><div className="content-grid">{contentItems.map((material,indeks) => <article className="content-card" key={material.title}><div className={`content-thumb thumb-${indeks + 1}`}><span>{material.tag}</span><div className="play-or-doc">{material.type === 'Film' ? '▶' : material.type[0]}</div></div><div className="content-body"><span>{material.type}</span><h3>{material.title}</h3><p>{material.meta}</p></div></article>)}</div></section>;
}

export function SekcjaRecenzji() {
  return <section className="section-block reviews-section"><div className="section-head"><div><span className="section-kicker">SPRAWDZONE PO KAPIEMU</span><h2>Recenzje, testy i porównania</h2><p>Wyróżnione materiały z konkretnym werdyktem.</p></div><Link className="text-link desktop-link" to="/recenzje">Zobacz wszystkie <Icon name="arrow" size={16}/></Link></div><div className="reviews-grid">{reviews.map((recenzja,indeks) => <article className={`review-card ${indeks === reviews.length - 1 ? 'locked-review' : ''}`} key={recenzja.title}><div className={`review-thumb review-thumb-${indeks + 1}`} aria-hidden="true"><i/><i/><i/></div><div className="review-copy"><span>{recenzja.category.split(' · ')[0]}</span><h3>{recenzja.title}</h3><p>{recenzja.verdict}</p></div><div className="score"><strong>{recenzja.score}</strong><small>/10</small></div></article>)}</div></section>;
}
