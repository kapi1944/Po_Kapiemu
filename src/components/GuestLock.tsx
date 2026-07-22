import { Icon } from './Icons';
import './GuestLock.css';

export const LIMIT_KART_DLA_GOSCIA = 3;

type WlasciwosciBlokadyDlaGoscia = {
  tytul?: string;
  opis?: string;
  kompaktowa?: boolean;
};

export function BlokadaDlaGoscia({
  tytul = 'Więcej po zalogowaniu',
  opis = 'Zaloguj się, aby odblokować dalszą zawartość.',
  kompaktowa = false,
}: WlasciwosciBlokadyDlaGoscia) {
  return <div className={`guest-lock-overlay ${kompaktowa ? 'guest-lock-overlay--compact' : ''}`} role="note" aria-label={tytul}>
    <span className="guest-lock-overlay__icon"><Icon name="lock" size={18}/></span>
    <strong>{tytul}</strong>
    <span>{opis}</span>
  </div>;
}
