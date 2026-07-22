import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { KomunikatFunkcji } from './FeatureNotice';
import { SzybkieWyszukiwanie } from '../moduly/wyszukiwanie/SzybkieWyszukiwanie';
import { Icon } from './Icons';

const nawigacjaGlowna = [
  ['/', 'Start', 'home'], ['/projekty', 'Projekty', 'projects'], ['/glosowania', 'Głosowania', 'vote'],
  ['/recenzje', 'Recenzje / Testy', 'reviews'], ['/kategorie', 'Kategorie', 'projects'], ['/tresci', 'Aktualności', 'content'],
  ['/wspolpraca', 'Współpraca', 'briefcase'], ['/spolecznosc', 'Społeczność', 'people'],
  ['/sprzet-i-polecane', 'Sprzęt i polecane', 'tool'], ['/faq', 'FAQ', 'help'],
] as const;

const nawigacjaUzytkownika = [
  ['/moje-projekty', 'Moje projekty', 'projects'], ['/obserwowane', 'Obserwowane', 'activity'],
  ['/zapisane', 'Zapisane', 'bookmark'], ['/moja-aktywnosc', 'Moja aktywność', 'activity'],
] as const;

type Motyw = 'system' | 'light' | 'dark';

function PozycjeNawigacji({ pozycje, zamknij }: { pozycje: readonly (readonly [string, string, string])[]; zamknij: () => void }) {
  return pozycje.map(([to, etykieta, ikona]) => <NavLink key={to} to={to} end={to === '/'} aria-label={etykieta} title={etykieta} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={zamknij}><Icon name={ikona} size={18}/><span>{etykieta}</span></NavLink>);
}

export function Layout() {
  const [motyw, ustawMotyw] = useState<Motyw>(() => (localStorage.getItem('pk-theme') as Motyw) || 'dark');
  const [menuMobilneOtwarte, ustawMenuMobilneOtwarte] = useState(false);
  const [widokKompaktowy, ustawWidokKompaktowy] = useState(false);

  useEffect(() => {
    const korzen = document.documentElement;
    if (motyw === 'system') korzen.removeAttribute('data-theme'); else korzen.setAttribute('data-theme', motyw);
    localStorage.setItem('pk-theme', motyw);
  }, [motyw]);

  const zmienMotyw = () => ustawMotyw(obecny => obecny === 'system' ? 'light' : obecny === 'light' ? 'dark' : 'system');
  const etykietaMotywu = motyw === 'system' ? 'System' : motyw === 'light' ? 'Jasny' : 'Ciemny';
  const zamknijMenu = () => ustawMenuMobilneOtwarte(false);

  return <div className={`app-shell ${widokKompaktowy ? 'is-compact' : ''}`}>
    <aside className={`sidebar ${menuMobilneOtwarte ? 'is-open' : ''}`}>
      <div className="sidebar-scroll">
        <div className="brand-block"><NavLink to="/" className="brand" onClick={zamknijMenu}><div className="brand-mark">PK</div><div className="brand-copy"><strong>Po Kapiemu</strong><span>Projekty. Testy. Konkrety.</span></div></NavLink></div>
        <p className="sidebar-caption">CENTRUM DOWODZENIA</p>
        <nav className="side-nav" aria-label="Główna nawigacja"><PozycjeNawigacji pozycje={nawigacjaGlowna} zamknij={zamknijMenu}/></nav>
        <div className="sidebar-separator"/>
        <p className="sidebar-caption">MOJE</p>
        <nav className="side-nav" aria-label="Nawigacja użytkownika"><PozycjeNawigacji pozycje={nawigacjaUzytkownika} zamknij={zamknijMenu}/></nav>
        <div className="sidebar-separator"/>
        <section className="support-mini" aria-label="Wsparcie Po Kapiemu"><Icon name="coffee" size={20}/><div><b>Wesprzyj rozwój</b><span>Postaw kawę Po Kapiemu</span></div><NavLink to="/wsparcie" aria-label="Zobacz możliwości wsparcia"><Icon name="arrow" size={16}/></NavLink></section>
        <NavLink className="sidebar-add" to="/dodaj-pomysl"><Icon name="plus" size={18}/><span>Dodaj pomysł</span></NavLink>
        <div className="sidebar-social" aria-label="Media społecznościowe"><a href="https://www.youtube.com" aria-label="YouTube"><span>YT</span></a><a href="https://www.github.com" aria-label="GitHub"><span>GH</span></a><NavLink to="/kontakt" aria-label="Kontakt"><Icon name="mail" size={15}/></NavLink></div>
        <button className="theme-switch" onClick={zmienMotyw} aria-label={`Zmień motyw. Obecnie: ${etykietaMotywu}`}><Icon name={motyw === 'dark' ? 'moon' : 'sun'} size={17}/><span>Motyw: {etykietaMotywu}</span></button>
        <KomunikatFunkcji klasaKontenera="komunikat-funkcji--boczny" klasaPrzycisku="sidebar-profile" etykieta="Informacja o koncie użytkownika" tytul="Konto użytkownika" opis="Logowanie i pełny profil są w przygotowaniu. Docelowo pozwolą zarządzać zapisanymi projektami i aktywnością."><span className="profile-avatar">K</span><span className="profile-copy"><b>Gość</b><small>Zaloguj się do konta</small></span><Icon name="arrow" size={15}/></KomunikatFunkcji>
        <div className="mini-status"><span className="pulse-dot"/> Po Kapiemu · beta</div>
      </div>
    </aside>
    {menuMobilneOtwarte && <button className="mobile-overlay" aria-label="Zamknij menu" onClick={zamknijMenu}/>}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-view"><span>Widok</span><button className={widokKompaktowy ? 'active' : ''} onClick={() => ustawWidokKompaktowy(true)}>Kompaktowy</button><button className={widokKompaktowy ? '' : 'active'} onClick={() => ustawWidokKompaktowy(false)}>Pełny</button></div>
        <SzybkieWyszukiwanie/>
        <div className="topbar-actions"><NavLink className="button primary compact topbar-add" to="/dodaj-pomysl"><Icon name="plus" size={16}/><span>Dodaj pomysł</span></NavLink><KomunikatFunkcji klasaPrzycisku="topbar-theme" etykieta="Informacja o powiadomieniach" tytul="Powiadomienia" opis="Centrum powiadomień jest w przygotowaniu. Będzie zbierać ważne zmiany w projektach i aktywność."><Icon name="bell" size={17}/></KomunikatFunkcji><button className="topbar-theme" onClick={zmienMotyw} aria-label={`Zmień motyw. Obecnie: ${etykietaMotywu}`}><Icon name={motyw === 'dark' ? 'moon' : 'sun'} size={17}/></button><details className="account-menu-wrap"><summary className="account-button"><Icon name="user" size={16}/><span>Konto</span></summary><nav className="account-menu" aria-label="Menu konta"><NavLink to="/moje-projekty">Moje projekty</NavLink><NavLink to="/obserwowane">Obserwowane</NavLink><NavLink to="/zapisane">Zapisane</NavLink><NavLink to="/moja-aktywnosc">Moja aktywność</NavLink></nav></details></div>
      </header>
      <header className="mobile-header"><NavLink to="/" className="mobile-brand"><span className="brand-mark small">PK</span><strong>Po Kapiemu</strong></NavLink><button className="icon-button" onClick={() => ustawMenuMobilneOtwarte(!menuMobilneOtwarte)} aria-label={menuMobilneOtwarte ? 'Zamknij menu' : 'Otwórz menu'}><Icon name="menu"/></button></header>
      <Outlet/>
    </main>
  </div>;
}
