import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PunktGalerii } from '../../data/projectDetails';
import { Icon } from '../Icons';

function czyPoleEdycyjne(element: EventTarget | null) {
  if (!(element instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable;
}

export function GaleriaProjektu({ punkty }: { punkty:PunktGalerii[] }) {
  const [punkt, ustawPunkt] = useState(0);
  const [medium, ustawMedium] = useState(0);
  const [pelnyEkran, ustawPelnyEkran] = useState(false);
  const [natywnyPelnyEkran, ustawNatywnyPelnyEkran] = useState(false);
  const kontener = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filmDialogu = useRef<HTMLVideoElement>(null);
  const otwierajacy = useRef<HTMLElement | null>(null);
  const startX = useRef<number | null>(null);
  const liczbaMediow = useRef(0);
  const prefiksId = useId();

  const bezpiecznyPunkt = punkty.length ? Math.min(punkt, punkty.length - 1) : 0;
  const wybrany = punkty[bezpiecznyPunkt];
  const media = wybrany?.media ?? [];
  liczbaMediow.current = media.length;
  const bezpieczneMedium = media.length ? Math.min(medium, media.length - 1) : 0;
  const wybraneMedium = media[bezpieczneMedium];

  const zmienMedium = useCallback((kierunek: number) => {
    ustawMedium(obecne => {
      const liczba = liczbaMediow.current;
      return liczba ? (obecne + kierunek + liczba) % liczba : 0;
    });
  }, []);

  const zatrzymajFilm = useCallback(() => {
    const film = filmDialogu.current;
    if (!film) return;
    film.pause();
    film.currentTime = 0;
  }, []);

  const zamknijDialog = useCallback(() => {
    zatrzymajFilm();
    if (document.fullscreenElement && dialog.current?.contains(document.fullscreenElement)) {
      void document.exitFullscreen().catch(() => undefined);
    }
    if (dialog.current?.open) dialog.current.close();
    ustawPelnyEkran(false);
    otwierajacy.current?.focus();
  }, [zatrzymajFilm]);

  useEffect(() => {
    ustawPunkt(obecny => punkty.length ? Math.min(obecny, punkty.length - 1) : 0);
  }, [punkty.length]);

  useEffect(() => {
    ustawMedium(obecne => media.length ? Math.min(obecne, media.length - 1) : 0);
  }, [bezpiecznyPunkt, media.length]);

  useEffect(() => {
    const obsluzKlawisz = (zdarzenie: KeyboardEvent) => {
      if (czyPoleEdycyjne(zdarzenie.target)) return;
      const focusWGalerii = kontener.current?.contains(document.activeElement);
      if (!focusWGalerii && !dialog.current?.open) return;
      if (zdarzenie.key === 'ArrowLeft') {
        zdarzenie.preventDefault();
        zmienMedium(-1);
      }
      if (zdarzenie.key === 'ArrowRight') {
        zdarzenie.preventDefault();
        zmienMedium(1);
      }
    };
    window.addEventListener('keydown', obsluzKlawisz);
    return () => window.removeEventListener('keydown', obsluzKlawisz);
  }, [zmienMedium]);

  useEffect(() => {
    if (pelnyEkran && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [pelnyEkran]);

  useEffect(() => {
    const obsluzPelnyEkran = () => ustawNatywnyPelnyEkran(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', obsluzPelnyEkran);
    return () => {
      document.removeEventListener('fullscreenchange', obsluzPelnyEkran);
      zatrzymajFilm();
    };
  }, [zatrzymajFilm]);

  if (!punkty.length) return <p className="galeria-pusta">Galeria nie zawiera jeszcze mediów.</p>;

  const wybierzPunkt = (indeks: number) => {
    ustawPunkt(indeks);
    ustawMedium(0);
  };
  const otworzDialog = (element: HTMLElement) => {
    if (!wybraneMedium) return;
    otwierajacy.current = element;
    ustawPelnyEkran(true);
  };
  const otworzPelnyEkranFilmu = async () => {
    if (filmDialogu.current?.requestFullscreen) await filmDialogu.current.requestFullscreen();
  };
  const idPanelu = `${prefiksId}-panel-${wybrany.id}`;
  const czyPelnyEkranFilmuDostepny = typeof document.documentElement.requestFullscreen === 'function';

  return <div className="galeria-projektu" ref={kontener}>
    <div className="galeria-os" role="tablist" aria-label="Etapy galerii">{punkty.map((element, indeks) => <button
      id={`${prefiksId}-tab-${element.id}`}
      type="button"
      role="tab"
      aria-selected={indeks === bezpiecznyPunkt}
      aria-controls={`${prefiksId}-panel-${element.id}`}
      tabIndex={indeks === bezpiecznyPunkt ? 0 : -1}
      key={element.id}
      onClick={() => wybierzPunkt(indeks)}
    >
      {element.miniatura ? <img src={element.miniatura} alt={`Miniatura etapu: ${element.tytul}`}/> : <span className="galeria-os__bez-miniatury" aria-hidden="true"/>}
      <span>{element.data}</span><b>{element.tytul}</b>
    </button>)}</div>
    <div id={idPanelu} role="tabpanel" aria-labelledby={`${prefiksId}-tab-${wybrany.id}`}>
      {!media.length
        ? <p className="galeria-pusta">Ten punkt galerii nie zawiera jeszcze mediów.</p>
        : <>
          <div className="galeria-karuzela" onPointerDown={zdarzenie => { startX.current = zdarzenie.clientX; }} onPointerUp={zdarzenie => {
            if (startX.current !== null && Math.abs(zdarzenie.clientX - startX.current) > 36) zmienMedium(zdarzenie.clientX < startX.current ? 1 : -1);
            startX.current = null;
          }}>
            <button type="button" className="icon-button" aria-label="Poprzednie medium" disabled={media.length < 2} onClick={() => zmienMedium(-1)}><Icon name="previous"/></button>
            {media.map((element, indeks) => <button type="button" key={element.id} className={indeks === bezpieczneMedium ? 'aktywne' : ''} aria-label={`Wybierz ${element.typ === 'video' ? 'film' : 'obraz'} ${indeks + 1}`} aria-pressed={indeks === bezpieczneMedium} onClick={() => ustawMedium(indeks)}>
              {element.typ === 'image' ? <img src={element.url} alt={element.opis ?? `Obraz ${indeks + 1}`}/> : <span>Film {indeks + 1}</span>}
            </button>)}
            <button type="button" className="icon-button" aria-label="Następne medium" disabled={media.length < 2} onClick={() => zmienMedium(1)}><Icon name="next"/></button>
          </div>
          <div className="galeria-podglad">
            {wybraneMedium.typ === 'image' ? <img src={wybraneMedium.url} alt={wybraneMedium.opis ?? ''}/> : <video controls src={wybraneMedium.url}/>}
            <div><p>{wybraneMedium.opis}</p><button type="button" className="button secondary compact" onClick={zdarzenie => otworzDialog(zdarzenie.currentTarget)}><Icon name="fullscreen" size={15}/> Pełny ekran</button></div>
          </div>
        </>}
    </div>
    <dialog ref={dialog} className="galeria-dialog" aria-label={wybraneMedium?.opis ?? 'Pełnoekranowy podgląd medium'} onCancel={zdarzenie => { zdarzenie.preventDefault(); zamknijDialog(); }} onClick={zdarzenie => { if (zdarzenie.currentTarget === zdarzenie.target) zamknijDialog(); }}>
      {pelnyEkran && wybraneMedium && <div className="galeria-dialog__zawartosc">
        {wybraneMedium.typ === 'image'
          ? <img src={wybraneMedium.url} alt={wybraneMedium.opis ?? ''}/>
          : <><video ref={filmDialogu} controls src={wybraneMedium.url}/>{czyPelnyEkranFilmuDostepny && <button type="button" className="button secondary compact" onClick={() => void otworzPelnyEkranFilmu()}>{natywnyPelnyEkran ? 'Film jest na pełnym ekranie' : 'Pełny ekran filmu'}</button>}</>}
        <button type="button" className="button" onClick={zamknijDialog}>Zamknij</button>
      </div>}
    </dialog>
  </div>;
}
