import { useContext } from 'react';
import { kontekstAutoryzacji } from './kontekstAutoryzacji';

export function useAutoryzacja() {
  const wartosc = useContext(kontekstAutoryzacji);
  if (!wartosc) throw new Error('useAutoryzacja wymaga DostawcyAutoryzacji.');
  return wartosc;
}
