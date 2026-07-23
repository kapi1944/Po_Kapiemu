import { Link } from 'react-router-dom';
import { aktywnosci, contentItems, etykietyTypowMaterialowRecenzenckich, etykietyTypowTresci, poll, projects, reviews, type ProjectStatus } from '../data/siteData';
import { BlokadaDlaGoscia, LIMIT_KART_DLA_GOSCIA } from './GuestLock';
import { Icon } from './Icons';
import { KomunikatFunkcji } from './FeatureNotice';

const LIMIT_RECENZJI_DLA_GOSCIA = 2;

const grupyStatusow: Array<{ etykieta:string; statusy:ProjectStatus[]; kolor:string }> = [
  { etykieta:'W realizacji', statusy:['W trakcie','Testy','Aktywny'], kolor:'var(--technical)' },
  { etykieta:'W planach', statusy:['Pomysł','Planowanie'], kolor:'var(--blocks)' },
  { etykieta:'Zakończone', statusy:['Zakończony'], kolor:'var(--experimental)' },
  { etykieta:'Wstrzymane', statusy:['Wstrzymany'], kolor:'var(--muted)' },
];

export function PanelPodsumowania() {
  const liczbaProjektow = projects.length;
  const liczbaAktywnychProjektow = projects.filter(projekt => projekt.active).length;
  const liczbaAktywnosci = aktywnosci.length;
  const liczbaMaterialow = contentItems.length;
  const liczbaAktywnychGlosowan = poll.options.length ? 1 : 0;
  const liczbaGlosow = poll.options.reduce((suma, opcja) => suma + opcja.votes, 0);
  const rozkladStatusow = grupyStatusow.map(grupa => ({ ...grupa, liczba:projects.filter(projekt => grupa.statusy.includes(projekt.status)).length }));
  let poczatekSegmentu = 0;
  const tloRingu = rozkladStatusow.map(grupa => { const koniecSegmentu = poczatekSegmentu + (liczbaProjektow ? grupa.liczba / liczbaProjektow * 100 : 0); const segment = `${grupa.kolor} ${poczatekSegmentu}% ${koniecSegmentu}%`; poczatekSegmentu = koniecSegmentu; return segment; }).join(',');
  return <section className="summary-layout" aria-label="Szybki przegląd i status ogólny">
    <div className="summary-grid"><article className="summary-card technical"><Icon name="projects" size={19}/><div><b>{liczbaAktywnychProjektow}</b><span>Aktywne projekty</span></div><small>{liczbaProjektow} projektów łącznie</small></article><article className="summary-card music"><Icon name="vote" size={19}/><div><b>{liczbaAktywnychGlosowan}</b><span>Aktywne głosowania</span></div><small>{liczbaGlosow} oddanych głosów</small></article><article className="summary-card blocks"><Icon name="activity" size={19}/><div><b>{liczbaAktywnosci}</b><span>Nowe aktywności</span></div><small>Od ostatniej wizyty</small></article><article className="summary-card experimental"><Icon name="content" size={19}/><div><b>{liczbaMaterialow}</b><span>Do publikacji</span></div><small>Materiały w kolejce</small></article></div>
    <article className="overall-status"><div className="status-ring" style={{background:`conic-gradient(${tloRingu})`}}><div className="status-ring-content"><strong>{liczbaProjektow}</strong><span>projektów łącznie</span></div></div><div className="status-legend"><h2>Status ogólny</h2><ul>{rozkladStatusow.map(grupa => <li key={grupa.etykieta}><i style={{background:grupa.kolor}}/><span>{grupa.etykieta}</span><b>{grupa.liczba}</b></li>)}</ul></div></article>
  </section>;
}

export function FeedAktywnosci() {
  return <section className="activity-panel" aria-labelledby="naglowek-aktywnosci"><div className="compact-heading"><div><span className="section-kicker">NA ŻYWO</span><h2 id="naglowek-aktywnosci">Teraz się dzieje</h2></div><Link className="text-link" to="/tresci">Cały feed <Icon name="arrow" size={15}/></Link></div><div className="activity-list">{aktywnosci.map(({ikona,kolor,przed,wyroznienie,po,czas}) => <div key={czas}><span className={`activity-icon ${kolor}`}><Icon name={ikona} size={15}/></span><p>{przed}{wyroznienie && <b>{wyroznienie}</b>}{po}<small>{czas}</small></p></div>)}</div></section>;
}

export function KartaGlosowania() {
  const liczbaGlosow = poll.options.reduce((suma, opcja) => suma + opcja.votes, 0);
  return <section className="poll-card feature-card" aria-labelledby="naglowek-glosowania"><div className="card-topline"><span className="tag hot">AKTYWNE GŁOSOWANIE</span><span className="binding">Niewiążące</span></div><h2 id="naglowek-glosowania">{poll.question}</h2><p>Wybór społeczności pomaga ustalić kolejność pracy.</p><div className="poll-options">{poll.options.map((opcja, indeks) => { const procent = Math.round(opcja.votes / liczbaGlosow * 100); return <KomunikatFunkcji key={opcja.label} klasaKontenera="komunikat-funkcji--pelna-szerokosc" klasaPrzycisku={`poll-result category-${opcja.category}`} etykieta={`Informacja o głosowaniu: ${opcja.label}`} tytul="Głosowanie na dashboardzie" opis="Oddanie głosu jest dostępne w module Głosowania. Ten widok pokazuje aktualne wyniki."><span className="poll-result-head"><span className="poll-letter">{String.fromCharCode(65 + indeks)}</span><span>{opcja.label}</span><b>{procent}%</b></span><span className="poll-result-track"><span style={{width:`${procent}%`}}/></span></KomunikatFunkcji>; })}</div><div className="poll-footer"><span>{liczbaGlosow} głosów</span><Link to="/glosowania">Zagłosuj <Icon name="arrow" size={15}/></Link></div></section>;
}

export function ModulyDashboardu({ czyZalogowany = false }: { czyZalogowany?: boolean }) {
  return <section className="dashboard-modules" aria-label="Dodatkowe moduły dashboardu">
    <article className="collaboration-card"><div><span className="section-kicker">WSPÓŁPRACA</span><h2>Zróbmy coś dobrego razem.</h2><p>Jasne zasady, praktyczne formaty i projekty pasujące do Po Kapiemu.</p><div className="collaboration-chips"><span>Sprzęt do testów</span><span>Sponsoring</span><span>Afiliacja</span><span>Wspólny projekt</span></div></div><Link className="button secondary compact" to="/wspolpraca">Napisz w sprawie współpracy <Icon name="arrow" size={15}/></Link></article>
    <article className="categories-card"><span className="section-kicker">KATEGORIE</span><h2>Szybki skrót</h2><div className="category-list"><Link className="technical" to="/kategorie#techniczne">Techniczne</Link><Link className="music" to="/kategorie#muzyczne">Muzyczne</Link><Link className="blocks" to="/kategorie#klockowe">Klockowe</Link><Link className="experimental" to="/kategorie#eksperymentalne">Eksperymentalne</Link></div></article>
    <article className={`reminders-card ${!czyZalogowany ? 'guest-lock-shell guest-lock-shell--module' : ''}`}>
      <div className={!czyZalogowany ? 'guest-lock-shell__content' : undefined} inert={!czyZalogowany || undefined} aria-hidden={!czyZalogowany || undefined}><div className="compact-heading"><div><span className="section-kicker">NADCHODZI</span><h2>Kolejna publikacja</h2></div></div><ul><li><i/><span>Kulisy budowy VidEdit Studio</span><small>Piątek · 18:00</small></li></ul></div>
      {!czyZalogowany && <BlokadaDlaGoscia kompaktowa tytul="Kolejna publikacja dla zalogowanych" opis="Zaloguj się, aby zobaczyć termin i pełną listę nadchodzących publikacji."/>}
    </article>
  </section>;
}

export function SekcjaPublikacji({ czyZalogowany = false }: { czyZalogowany?: boolean }) {
  return <section className="section-block"><div className="section-head"><div><span className="section-kicker">NOWE</span><h2>Ostatnio opublikowane</h2><p>Filmy, aktualizacje, artykuły i materiały do pobrania.</p></div><Link className="text-link desktop-link" to="/tresci">Wszystkie treści <Icon name="arrow" size={16}/></Link></div><div className="content-grid">{contentItems.map((material,indeks) => {
    const karta = <article className="content-card" key={material.title}><div className={`content-thumb thumb-${indeks + 1}`}><span>{material.tag}</span><div className="play-or-doc">{material.type === 'video' ? '▶' : etykietyTypowTresci[material.type][0]}</div></div><div className="content-body"><span>{etykietyTypowTresci[material.type]}</span><h3>{material.title}</h3><p>{material.meta}</p></div></article>;
    const zablokowanaDlaGoscia = !czyZalogowany && indeks >= LIMIT_KART_DLA_GOSCIA;
    if (!zablokowanaDlaGoscia) return karta;
    return <div className="guest-lock-shell guest-lock-shell--content" key={material.title}>
      <div className="guest-lock-shell__content" inert aria-hidden="true">{karta}</div>
      <BlokadaDlaGoscia kompaktowa tytul="Więcej treści po zalogowaniu" opis="Zaloguj się, aby zobaczyć dalsze publikacje i materiały do pobrania."/>
    </div>;
  })}</div></section>;
}

export function SekcjaRecenzji({ czyZalogowany = false }: { czyZalogowany?: boolean }) {
  const widoczneRecenzje = czyZalogowany
    ? reviews
    : reviews.slice(0, LIMIT_RECENZJI_DLA_GOSCIA);

  return <section className="section-block reviews-section">
    <div className="section-head">
      <div>
        <span className="section-kicker">SPRAWDZONE PO KAPIEMU</span>
        <h2>Recenzje, testy i porównania</h2>
        <p>Wyróżnione materiały z konkretnym werdyktem.</p>
      </div>

      <Link className="text-link desktop-link" to="/recenzje">
        Zobacz wszystkie <Icon name="arrow" size={16}/>
      </Link>
    </div>

    <div className="reviews-grid">
      {widoczneRecenzje.map((recenzja, indeks) =>
        <article className="review-card" key={recenzja.title}>
          <div
            className={`review-thumb review-thumb-${indeks + 1}`}
            aria-hidden="true"
          >
            <i/><i/><i/>
          </div>

          <div className="review-copy">
            <span>{etykietyTypowMaterialowRecenzenckich[recenzja.typ]}</span>
            <h3>{recenzja.title}</h3>
            <p>{recenzja.verdict}</p>
          </div>

          <div className="score">
            <strong>{recenzja.score}</strong>
            <small>/10</small>
          </div>
        </article>
      )}

      {!czyZalogowany &&
        <div className="guest-lock-shell guest-lock-shell--review">
          <div
            className="guest-lock-shell__content"
            inert
            aria-hidden="true"
          >
            <article className="review-card">
              <div
                className="review-thumb guest-lock-review-thumb"
                aria-hidden="true"
              >
                <i/><i/><i/>
              </div>

              <div
                className="review-copy guest-lock-review-copy"
                aria-hidden="true"
              >
                <span>Recenzja</span>
                <h3>Ukryty materiał</h3>
                <p>Dalsza zawartość dostępna po zalogowaniu.</p>
              </div>

              <div
                className="score guest-lock-review-score"
                aria-hidden="true"
              >
                <strong>–</strong>
                <small>/10</small>
              </div>
            </article>
          </div>

          <BlokadaDlaGoscia
            kompaktowa
            tytul="Więcej testów po zalogowaniu"
            opis="Zaloguj się, aby zobaczyć kolejne recenzje, testy i porównania."
          />
        </div>
      }
    </div>
  </section>;
}
