import { Link } from 'react-router-dom';
import { contentItems, poll, reviews } from '../data/siteData';
import { Icon } from './Icons';

const aktywnosci = [
 { ikona: 'projects', kolor: 'technical', tresc: <><b>Asystent BUR</b> otrzymał nowy import harmonogramów.</>, czas: '12 min temu' },
 { ikona: 'vote', kolor: 'music', tresc: <>Wystartowało głosowanie o kolejny materiał.</>, czas: '38 min temu' },
 { ikona: 'reviews', kolor: 'blocks', tresc: <>Nowa recenzja: <b>FiiO KA11</b> jest gotowa.</>, czas: 'Dzisiaj, 09:24' },
 { ikona: 'briefcase', kolor: 'experimental', tresc: <>Pojawiła się propozycja współpracy.</>, czas: 'Wczoraj' },
] as const;

export function PanelPodsumowania() {
 return <section className="summary-grid" aria-label="Szybki przegląd">
  <article className="summary-card technical"><Icon name="projects" size={19}/><div><b>3</b><span>Aktywne projekty</span></div><small>+1 w tym miesiącu</small></article>
  <article className="summary-card music"><Icon name="vote" size={19}/><div><b>1</b><span>Aktywne głosowanie</span></div><small>100 głosów</small></article>
  <article className="summary-card blocks"><Icon name="content" size={19}/><div><b>4</b><span>Nowe publikacje</span></div><small>Teraz się dzieje</small></article>
  <article className="summary-card experimental"><Icon name="reviews" size={19}/><div><b>3</b><span>Recenzje w kolejce</span></div><small>Do publikacji</small></article>
 </section>;
}

export function FeedAktywnosci() {
 return <section className="activity-panel" aria-labelledby="naglowek-aktywnosci">
  <div className="compact-heading"><div><span className="section-kicker">NA ŻYWO</span><h2 id="naglowek-aktywnosci">Teraz się dzieje</h2></div><Link className="text-link" to="/tresci">Cały feed <Icon name="arrow" size={15}/></Link></div>
  <div className="activity-list">{aktywnosci.map(({ ikona, kolor, tresc, czas }) => <div key={czas}><span className={`activity-icon ${kolor}`}><Icon name={ikona} size={15}/></span><p>{tresc}<small>{czas}</small></p></div>)}</div>
 </section>;
}

export function KartaGlosowania() {
 const liczbaGlosow = poll.options.reduce((suma, opcja) => suma + opcja.votes, 0);
 return <section className="poll-card feature-card" aria-labelledby="naglowek-glosowania">
  <div className="card-topline"><span className="tag hot">GŁOSOWANIE</span><span className="binding">Niewiążące</span></div>
  <h2 id="naglowek-glosowania">{poll.question}</h2>
  <p>Twój głos pomaga mi zdecydować, co ma dostać pierwszeństwo.</p>
  <div className="poll-options">{poll.options.map((opcja, indeks) => { const procent = Math.round(opcja.votes / liczbaGlosow * 100); return <button key={opcja.label}><span className="poll-letter">{String.fromCharCode(65 + indeks)}</span><span className="poll-name">{opcja.label}</span><b>{procent}%</b><i style={{ width: `${procent}%` }}/></button>; })}</div>
  <div className="poll-footer"><span>{liczbaGlosow} głosów w wersji demonstracyjnej</span><Link to="/glosowania">Zagłosuj <Icon name="arrow" size={15}/></Link></div>
 </section>;
}

export function ModulyDashboardu() {
 return <section className="dashboard-modules" aria-label="Dodatkowe moduły dashboardu">
  <article className="collaboration-card"><div><span className="section-kicker">WSPÓŁPRACA</span><h2>Masz pomysł na wspólny projekt?</h2><p>Szukasz partnerów lub chcesz dołączyć do czegoś ciekawego? Przejdź do miejsca współpracy.</p></div><Link className="button secondary compact" to="/wspolpraca">Przejdź do współpracy <Icon name="arrow" size={15}/></Link></article>
  <article className="categories-card"><span className="section-kicker">KATEGORIE</span><div className="category-list"><span className="technical">Techniczne</span><span className="music">Muzyczne</span><span className="blocks">Klockowe</span><span className="experimental">Eksperymentalne</span></div></article>
  <article className="reminders-card"><div className="compact-heading"><div><span className="section-kicker">PLAN DNIA</span><h2>Przypomnienia</h2></div></div><ul><li><i/>Publikacja filmu o VidEdit <small>Dzisiaj</small></li><li><i/>Zamknięcie głosowania <small>Za 3 dni</small></li><li><i/>Aktualizacja strony WWW <small>W tym tygodniu</small></li></ul></article>
 </section>;
}

export function SekcjaPublikacji() {
 return <section className="section-block"><div className="section-head"><div><span className="section-kicker">NOWE</span><h2>Ostatnio opublikowane</h2><p>Filmy, aktualizacje, artykuły i materiały do pobrania.</p></div><Link className="text-link desktop-link" to="/tresci">Wszystkie treści <Icon name="arrow" size={16}/></Link></div><div className="content-grid">{contentItems.map((material, indeks) => <article className="content-card" key={material.title}><div className={`content-thumb thumb-${indeks + 1}`}><span>{material.tag}</span><div className="play-or-doc">{material.type === 'Film' ? '▶' : material.type[0]}</div></div><div className="content-body"><span>{material.type}</span><h3>{material.title}</h3><p>{material.meta}</p></div></article>)}</div></section>;
}

export function SekcjaRecenzji() {
 return <section className="section-block reviews-section"><div className="section-head"><div><span className="section-kicker">SPRAWDZONE PO KAPIEMU</span><h2>Ostatnie recenzje</h2></div><Link className="text-link desktop-link" to="/recenzje">Więcej recenzji <Icon name="arrow" size={16}/></Link></div><div className="reviews-grid">{reviews.map(recenzja => <article className="review-card" key={recenzja.title}><div className="review-mark">{recenzja.title.slice(0, 2).toUpperCase()}</div><div className="review-copy"><span>{recenzja.category}</span><h3>{recenzja.title}</h3><p>{recenzja.verdict}</p><small>{recenzja.author} · {recenzja.date}</small></div><div className="score"><strong>{recenzja.score}</strong><small>/10</small></div></article>)}</div></section>;
}
