import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';

const Naglowek = ({ kicker, title, desc }: { kicker:string; title:string; desc:string }) => <div className="page-hero"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{desc}</p></div>;

export function CategoriesPage() {
  return <div className="page-wrap inner-page"><Naglowek kicker="KATEGORIE" title="Cztery obszary. Jeden sposób działania." desc="Kategorie porządkują projekty i materiały bez mieszania ich znaczenia z technicznymi identyfikatorami."/><div className="simple-page-grid"><article id="techniczne" className="simple-page-card category-technical"><span className="category-badge">Techniczne</span><h2>Narzędzia i automatyzacje</h2><p>Aplikacje, rozszerzenia i workflow, które rozwiązują konkretne problemy.</p></article><article id="muzyczne" className="simple-page-card category-music"><span className="category-badge">Muzyczne</span><h2>Audio i muzyka</h2><p>Materiały, urządzenia i eksperymenty związane z dźwiękiem.</p></article><article id="klockowe" className="simple-page-card category-blocks"><span className="category-badge">Klockowe</span><h2>Konstrukcje i modele</h2><p>Projekty budowane element po elemencie oraz ich dokumentacja.</p></article><article id="eksperymentalne" className="simple-page-card category-experimental"><span className="category-badge">Eksperymentalne</span><h2>Laboratorium pomysłów</h2><p>Rzeczy nietypowe, prototypowe albo trudne do przypisania gdzie indziej.</p></article></div></div>;
}

export function FaqPage() {
  const pytania = [
    ['Czym jest Po Kapiemu?','To centrum projektów, testów, publikacji i decyzji podejmowanych wspólnie ze społecznością.'],
    ['Czy mogę zaproponować projekt?','Tak. Formularz Dodaj pomysł działa demonstracyjnie i jest gotowy do późniejszego podpięcia zapisu.'],
    ['Czy głosowania są wiążące?','Obecnie są demonstracyjne i pomagają pokazać planowany sposób ustalania priorytetów.'],
    ['Czy można wesprzeć rozwój?','Moduł wsparcia pokazuje planowany model. Płatności nie są jeszcze podłączone.'],
  ];
  return <div className="page-wrap inner-page"><Naglowek kicker="FAQ" title="Najczęstsze pytania, bez krążenia." desc="Krótko o projektach, głosowaniach, wsparciu i obecnym zakresie wersji demonstracyjnej."/><div className="faq-list">{pytania.map(([pytanie,odpowiedz]) => <details key={pytanie}><summary>{pytanie}</summary><p>{odpowiedz}</p></details>)}</div></div>;
}

export function EquipmentPage() {
  return <div className="page-wrap inner-page"><Naglowek kicker="SPRZĘT I POLECANE" title="Rzeczy, których naprawdę używam." desc="Stanowisko, audio, wideo i polecane produkty są oddzielone od finansowego wsparcia Po Kapiemu."/><div className="three-cards"><article className="info-card"><Icon name="tool"/><h3>Stanowisko pracy</h3><p>Komputery, monitory i akcesoria wykorzystywane przy projektach.</p></article><article className="info-card"><Icon name="reviews"/><h3>Audio i wideo</h3><p>Sprzęt używany podczas testów, nagrań i montażu.</p></article><article className="info-card"><Icon name="external"/><h3>Polecane</h3><p>Lista produktów z jasną informacją, kiedy link ma charakter afiliacyjny.</p></article></div></div>;
}

const opisyWidokow = {
  projekty:['MOJE PROJEKTY','Twoje projekty w jednym miejscu.','Po zalogowaniu tutaj pojawią się własne projekty, szkice oraz ich statusy.'],
  obserwowane:['OBSERWOWANE','Śledź to, co jest dla Ciebie ważne.','Aktualizacje obserwowanych projektów będą dostępne po podpięciu konta.'],
  zapisane:['ZAPISANE','Materiały na później.','Zapisane projekty, testy i porównania będą zsynchronizowane z kontem.'],
  aktywnosc:['MOJA AKTYWNOŚĆ','Twój ślad w Po Kapiemu.','Głosy, komentarze i zgłoszone pomysły pojawią się tutaj po zalogowaniu.'],
} as const;

export function AccountPlaceholderPage({ rodzaj }: { rodzaj:keyof typeof opisyWidokow }) {
  const [kicker,title,desc] = opisyWidokow[rodzaj];
  return <div className="page-wrap inner-page"><Naglowek kicker={kicker} title={title} desc={desc}/><article className="wide-card"><Icon name="lock" size={30}/><h2>Funkcja konta jest przygotowana w interfejsie</h2><p className="demo-note">Ta wersja nie udaje działającego logowania ani zapisu na serwerze. Widok zostanie podłączony do prawdziwego konta w osobnym etapie.</p></article></div>;
}

export function AddIdeaPage() {
  const [wyslano, ustawWyslano] = useState(false);
  return <div className="page-wrap inner-page"><Naglowek kicker="DODAJ POMYSŁ" title="Co warto zbudować albo sprawdzić?" desc="Zaproponuj projekt, test lub materiał. Formularz działa lokalnie jako demonstracja przyszłego procesu."/><form className="contact-form wide-card" onSubmit={zdarzenie => { zdarzenie.preventDefault(); ustawWyslano(true); }}><label>Tytuł pomysłu<input required name="tytul" placeholder="Krótka, konkretna nazwa"/></label><label>Kategoria<select name="kategoria"><option>Techniczne</option><option>Muzyczne</option><option>Klockowe</option><option>Eksperymentalne</option></select></label><label>Opis<textarea required name="opis" rows={6} placeholder="Jaki problem rozwiązuje i dlaczego warto się nim zająć?"/></label><button className="button primary" type="submit"><Icon name="plus" size={16}/> Dodaj pomysł</button>{wyslano && <div className="form-success">✓ Pomysł został przyjęty w wersji demonstracyjnej.</div>}</form></div>;
}

export function NotFoundPage() {
  return <div className="page-wrap inner-page"><div className="locked-page"><span className="section-kicker">404</span><h1>Tego miejsca jeszcze nie ma.</h1><p>Link nie prowadzi do istniejącego widoku Po Kapiemu.</p><Link className="button primary" to="/">Wróć na start <Icon name="arrow" size={16}/></Link></div></div>;
}
