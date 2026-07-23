import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedAktywnosci, KartaGlosowania, ModulyDashboardu, PanelPodsumowania, SekcjaPublikacji, SekcjaRecenzji } from '../components/DashboardPanels';
import { BlokadaDlaGoscia, LIMIT_KART_DLA_GOSCIA } from '../components/GuestLock';
import { Icon } from '../components/Icons';
import { ProjectCard } from '../components/ProjectCard';
import { projects, type ProjectCategory } from '../data/siteData';

type TrybProjektow = 'active' | 'all';
type FiltrKategorii = 'all' | ProjectCategory;
const filtryKategorii: Array<{ value: FiltrKategorii; label: string }> = [
  { value:'all', label:'Wszystkie' }, { value:'technical', label:'Techniczne' }, { value:'music', label:'Muzyczne' }, { value:'blocks', label:'Klockowe' }, { value:'experimental', label:'Eksperymentalne' },
];

// Tymczasowo strona działa jako gość. Po podpięciu auth tę wartość zastąpi rzeczywisty stan sesji.
const CZY_UZYTKOWNIK_ZALOGOWANY = false;

export function HomePage() {
  const [tryb, ustawTryb] = useState<TrybProjektow>('active');
  const [kategoria, ustawKategorie] = useState<FiltrKategorii>('all');
  const widoczneProjekty = useMemo(() => projects.filter(projekt => (tryb === 'all' || projekt.active) && (kategoria === 'all' || projekt.category === kategoria)), [tryb, kategoria]);
  return <div className="page-wrap home-page">
    <section className="hero" aria-labelledby="naglowek-powitalny"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> Dzień dobry, Kapi. System działa.</div><h1 id="naglowek-powitalny">Pomysły zamieniam<br/><span>w działające projekty.</span></h1><p>Jedno miejsce do śledzenia narzędzi, testów, publikacji i decyzji podejmowanych razem ze społecznością.</p><div className="hero-actions"><Link className="button primary" to="/projekty">Zobacz projekty <Icon name="arrow" size={17}/></Link></div></div><div className="hero-banner" role="img" aria-label="Nastrojowa ilustracja stanowiska pracy z monitorami i ciepłym światłem"><div className="hero-screen" aria-hidden="true"><span/><span/></div><div className="hero-status"><span className="live-dot"/> Ostatnia synchronizacja: teraz</div></div></section>
    <PanelPodsumowania/>
    <section className="section-block projects-section" aria-labelledby="naglowek-projektow"><div className="section-head"><div><span className="section-kicker">TERAZ ROBIĘ</span><h2 id="naglowek-projektow">Aktywne projekty</h2><p>Najważniejsze rzeczy, nad którymi aktualnie pracuję.</p></div><div className="segmented" role="group" aria-label="Zakres projektów"><button className={tryb === 'active' ? 'active' : ''} onClick={() => ustawTryb('active')}>Aktywne</button><button className={tryb === 'all' ? 'active' : ''} onClick={() => ustawTryb('all')}>Wszystkie</button></div></div><div className="project-filters" aria-label="Filtr kategorii">{filtryKategorii.map(filtr => <button key={filtr.value} data-category={filtr.value === 'all' ? undefined : filtr.value} className={kategoria === filtr.value ? 'active' : ''} onClick={() => ustawKategorie(filtr.value)}>{filtr.label}</button>)}</div><div className="projects-grid">{widoczneProjekty.map((projekt, indeks) => {
      const zablokowanyDlaGoscia = !CZY_UZYTKOWNIK_ZALOGOWANY && indeks >= LIMIT_KART_DLA_GOSCIA;
      if (!zablokowanyDlaGoscia) return <ProjectCard key={projekt.slug} project={projekt}/>;
      return <div className="guest-lock-shell guest-lock-shell--project" key={projekt.slug}>
        <div className="guest-lock-shell__content" inert aria-hidden="true"><ProjectCard project={projekt}/></div>
        <BlokadaDlaGoscia kompaktowa tytul="Więcej projektów po zalogowaniu" opis="Zaloguj się, aby zobaczyć kolejne projekty i ich pełny status."/>
      </div>;
    })}</div><div className="section-more"><Link to="/projekty">Zobacz wszystkie projekty <Icon name="arrow" size={16}/></Link></div></section>
    <section className="dashboard-row"><FeedAktywnosci/><KartaGlosowania/></section><ModulyDashboardu czyZalogowany={CZY_UZYTKOWNIK_ZALOGOWANY}/><SekcjaPublikacji czyZalogowany={CZY_UZYTKOWNIK_ZALOGOWANY}/><SekcjaRecenzji czyZalogowany={CZY_UZYTKOWNIK_ZALOGOWANY}/>
    <section className="support-strip"><div><span className="section-kicker">WSPARCIE</span><h2>Chcesz pomóc mi robić więcej?</h2><p>Na razie bez płatności — pierwsza wersja pokazuje, jak ta część serwisu będzie działała.</p></div><Link className="button secondary" to="/wsparcie"><Icon name="heart" size={17}/> Zobacz możliwości wsparcia</Link></section>
  </div>;
}
