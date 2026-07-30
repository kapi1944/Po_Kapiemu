import type { MediumGalerii } from '../../data/projectDetails';
import { czyBezpiecznyAdres } from './logikaMediow';

function normalizujMedium(medium: string | MediumGalerii, indeks: number): MediumGalerii {
  if (typeof medium !== 'string') return medium;
  const sciezka = medium.split(/[?#]/)[0].toLowerCase();
  const typ = /\.(mp4|webm|ogv|ogg|mov|m4v)$/.test(sciezka) ? 'video' : 'image';
  return { id:`medium-${indeks}`, typ, url:medium };
}

export function MediaProjektu({ media, klasa }: { media?: Array<string | MediumGalerii>; klasa?:string }) {
  if (!media?.length) return null;
  const poprawne = media.map(normalizujMedium).filter(element => czyBezpiecznyAdres(element.url));
  if (!poprawne.length) return null;
  return <div className={klasa ?? 'media-projektu'}>{poprawne.map(element => element.typ === 'video'
    ? <video key={element.id} controls src={element.url} aria-label={element.opis ?? 'Film projektu'}/>
    : <img key={element.id} src={element.url} alt={element.opis ?? 'Obraz projektu'}/>)}</div>;
}
