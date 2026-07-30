import type { DragEvent, ReactNode } from 'react';
import { Icon } from '../Icons';

type WlasciwosciSekcjiProjektu = {
  id: string;
  tytul: string;
  wyrozniona?: boolean;
  children: ReactNode;
  trybEdycji?: boolean;
  pierwsza?: boolean;
  ostatnia?: boolean;
  przesun: (kierunek:-1|1) => void;
  zmienWyroznienie: () => void;
  rozpocznijPrzeciaganie: (id:string) => void;
  upusc: (id:string, pozycja:'przed'|'po') => void;
};

export function SekcjaProjektu({ id, tytul, wyrozniona=false, children, trybEdycji=false, pierwsza=false, ostatnia=false, przesun, zmienWyroznienie, rozpocznijPrzeciaganie, upusc }: WlasciwosciSekcjiProjektu) {
  const przeciagnij = (zdarzenie: DragEvent<HTMLElement>) => {
    zdarzenie.preventDefault();
    const granice = zdarzenie.currentTarget.getBoundingClientRect();
    upusc(id, zdarzenie.clientY > granice.top + granice.height / 2 ? 'po' : 'przed');
  };

  return <section id={id} className={`sekcja-projektu ${wyrozniona ? 'sekcja-projektu--wyrozniona' : ''}`} aria-labelledby={`${id}-tytul`} onDragOver={trybEdycji ? zdarzenie => zdarzenie.preventDefault() : undefined} onDrop={trybEdycji ? przeciagnij : undefined}>
    <div className="sekcja-projektu__naglowek">
      <h2 id={`${id}-tytul`}>{tytul}</h2>
      {trybEdycji && <div className="edycja-sekcji">
        <button type="button" aria-label={`Przesuń sekcję ${tytul} w górę`} disabled={pierwsza} onClick={() => przesun(-1)}><Icon name="chevronUp" size={16}/></button>
        <button type="button" draggable aria-label={`Przeciągnij sekcję ${tytul}`} onDragStart={() => rozpocznijPrzeciaganie(id)}><Icon name="grip" size={16}/></button>
        <button type="button" aria-label={`Przesuń sekcję ${tytul} w dół`} disabled={ostatnia} onClick={() => przesun(1)}><Icon name="chevronDown" size={16}/></button>
        <button type="button" aria-pressed={wyrozniona} onClick={zmienWyroznienie}>Wyróżnij</button>
      </div>}
    </div>
    {children}
  </section>;
}
