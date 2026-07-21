import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedAktywnosci, KartaGlosowania, ModulyDashboardu, PanelPodsumowania, SekcjaPublikacji, SekcjaRecenzji } from '../components/DashboardPanels';
import { Icon } from '../components/Icons';
import { ProjectCard } from '../components/ProjectCard';
import { projects, type Project } from '../data/siteData';

type TrybProjektow = 'active' | 'all';
type FiltrKategorii = 'all' | Project['category'];

const filtryKategorii: Array<{ value: FiltrKategorii; label: string }> = [
 { value: 'all', label: 'Wszystkie' },
 { value: 'tools', label: 'Techniczne' },
 { value: 'video', label: 'Muzyczne' },
 { value: 'community', label: 'Klockowe' },
 { value: 'secret', label: 'Eksperymentalne' },
];

export function HomePage() {
 const [tryb, setTryb] = useState<TrybProjektow>('active');
 const [kategoria, setKategoria] = useState<FiltrKategorii>('all');
 const widoczneProjekty = useMemo(() => projects.filter(projekt => (tryb === 'all' || projekt.active) && (kategoria === 'all' || projekt.category === kategoria)), [tryb, kategoria]);

 return <div className="page-wrap home-page">
  <section className="hero" aria-labelledby="naglowek-powitalny">
   <div className="hero-copy">
    <div className="hero-kicker"><span className="live-dot"/> Witaj w Po Kapiemu! 👋</div>
    <h1 id="naglowek-powitalny">Twoje centrum projektów,<br/><span>pomysłów i współpracy.</span></h1>
    <p>Zwarty dashboard do śledzenia tego, co tworzę, testuję i rozwijam razem ze społecznością.</p>
    <div className="hero-actions"><Link className="button primary" to="/projekty">Zobacz projekty <Icon name="arrow" size={17}/></Link><Link className="button secondary" to="/glosowania">Weź udział <Icon name="vote" size={17}/></Link></div>
   </div>
   <div className="hero-console" aria-label="Neutralny podgląd procesu projektu">
    <div className="console-top"><b>PO KAPIEMU / WORKSPACE</b><div className="window-actions" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div></div>
    <div className="console-body"><div className="console-line wide"/><div className="console-line medium"/><div className="console-line short"/><div className="console-window"><div className="console-card c1"><span>01</span><b>BUILD</b></div><div className="console-card c2"><span>02</span><b>TEST</b></div><div className="console-card c3"><span>03</span><b>SHARE</b></div></div><div className="console-progress"><span/></div></div>
   </div>
  </section>

  <PanelPodsumowania/>

  <section className="section-block projects-section" aria-labelledby="naglowek-projektow">
   <div className="section-head"><div><span className="section-kicker">TERAZ ROBIĘ</span><h2 id="naglowek-projektow">Aktywne projekty</h2><p>Najważniejsze rzeczy, nad którymi aktualnie pracuję.</p></div><div className="segmented" role="group" aria-label="Zakres projektów"><button className={tryb === 'active' ? 'active' : ''} onClick={() => setTryb('active')}>Aktywne</button><button className={tryb === 'all' ? 'active' : ''} onClick={() => setTryb('all')}>Wszystkie</button></div></div>
   <div className="project-filters" aria-label="Filtr kategorii">{filtryKategorii.map(filtr => <button key={filtr.value} className={kategoria === filtr.value ? 'active' : ''} onClick={() => setKategoria(filtr.value)}>{filtr.label}</button>)}</div>
   <div className="projects-grid">{widoczneProjekty.map(projekt => <ProjectCard key={projekt.slug} project={projekt}/>)}</div>
   <div className="section-more"><Link to="/projekty">Przejdź do wszystkich projektów <Icon name="arrow" size={16}/></Link></div>
  </section>

  <section className="dashboard-row"><FeedAktywnosci/><KartaGlosowania/></section>
  <ModulyDashboardu/>
  <SekcjaPublikacji/>
  <SekcjaRecenzji/>

  <section className="support-strip"><div><span className="section-kicker">WSPARCIE</span><h2>Chcesz pomóc mi robić więcej?</h2><p>Na razie bez płatności — pierwsza wersja pokazuje, jak ta część serwisu będzie działała.</p></div><Link className="button secondary" to="/wsparcie"><Icon name="heart" size={17}/> Zobacz możliwości wsparcia</Link></section>
 </div>;
}
