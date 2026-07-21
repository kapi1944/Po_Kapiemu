import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';

const navigation=[['/','Start','home'],['/projekty','Projekty','projects'],['/glosowania','Głosowania','vote'],['/recenzje','Recenzje','reviews'],['/wspolpraca','Współpraca','briefcase'],['/tresci','Aktualności','content'],['/spolecznosc','Społeczność','people'],['/wsparcie','Sprzęt i polecane','heart'],['/o-kapim','O Kapim','info'],['/kontakt','Kontakt','mail']] as const;
type Theme='system'|'light'|'dark';

export function Layout(){
 const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem('pk-theme') as Theme)||'system');
 const [mobileOpen,setMobileOpen]=useState(false);
 const [compact,setCompact]=useState(false);
 useEffect(()=>{const root=document.documentElement;if(theme==='system')root.removeAttribute('data-theme');else root.setAttribute('data-theme',theme);localStorage.setItem('pk-theme',theme)},[theme]);
 const cycleTheme=()=>setTheme(c=>c==='system'?'light':c==='light'?'dark':'system');
 const label=theme==='system'?'System':theme==='light'?'Jasny':'Ciemny';
 return <div className={`app-shell ${compact?'is-compact':''}`}>
  <aside className={`sidebar ${mobileOpen?'is-open':''}`}>
   <div className="brand-block"><NavLink to="/" className="brand" onClick={()=>setMobileOpen(false)}><div className="brand-mark">PK</div><div><strong>Po Kapiemu</strong><span>Projekty po mojemu</span></div></NavLink></div>
   <p className="sidebar-caption">CENTRUM DOWODZENIA</p>
   <nav className="side-nav" aria-label="Główna nawigacja">{navigation.map(([to,l,i])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`nav-item ${isActive?'active':''}`} onClick={()=>setMobileOpen(false)}><Icon name={i} size={18}/><span>{l}</span></NavLink>)}</nav>
   <div className="sidebar-foot"><div className="idea-cta"><Icon name="spark" size={18}/><div><b>Masz pomysł?</b><span>Dodaj go do rozmowy.</span></div></div><button className="theme-switch" onClick={cycleTheme} aria-label="Zmień motyw"><Icon name={theme==='dark'?'moon':'sun'} size={17}/><span>Motyw: {label}</span></button><div className="mini-status"><span className="pulse-dot"/> Po Kapiemu • beta</div></div>
  </aside>
  {mobileOpen&&<button className="mobile-overlay" aria-label="Zamknij menu" onClick={()=>setMobileOpen(false)}/>}
  <main className="main-area"><header className="topbar"><div className="topbar-view"><span>Widok</span><button className={compact?'':'active'} onClick={()=>setCompact(false)}>Pełny</button><button className={compact?'active':''} onClick={()=>setCompact(true)}>Kompaktowy</button></div><label className="topbar-search"><Icon name="search" size={16}/><input placeholder="Szukaj projektów, pomysłów…" aria-label="Szukaj projektów i pomysłów"/></label><div className="topbar-actions"><button className="topbar-theme" onClick={cycleTheme} aria-label="Zmień motyw"><Icon name={theme==='dark'?'moon':'sun'} size={17}/></button><button className="account-button"><Icon name="user" size={16}/> Zaloguj się</button></div></header><header className="mobile-header"><NavLink to="/" className="mobile-brand"><span className="brand-mark small">PK</span><strong>Po Kapiemu</strong></NavLink><button className="icon-button" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Otwórz menu"><Icon name="menu"/></button></header><Outlet/></main>
  <nav className="bottom-nav" aria-label="Nawigacja mobilna">{navigation.slice(0,4).map(([to,l,i])=><NavLink key={to} to={to} end={to==='/'}><Icon name={i} size={19}/><span>{l}</span></NavLink>)}<button onClick={()=>setMobileOpen(true)}><Icon name="menu" size={19}/><span>Menu</span></button></nav>
 </div>
}
