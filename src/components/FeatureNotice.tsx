import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

type WlasciwosciKomunikatuFunkcji = {
  children: ReactNode;
  etykieta: string;
  klasaPrzycisku?: string;
  klasaKontenera?: string;
  opis: string;
  tytul: string;
};

export function KomunikatFunkcji({ children, etykieta, klasaPrzycisku, klasaKontenera, opis, tytul }: WlasciwosciKomunikatuFunkcji) {
  const [otwarty, ustawOtwarty] = useState(false);
  const kontenerRef = useRef<HTMLDivElement>(null);
  const identyfikatorKomunikatu = useId();

  useEffect(() => {
    if (!otwarty) return;

    const obsluzNacisniecieKlawisza = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key === 'Escape') ustawOtwarty(false);
    };
    const obsluzNacisnieciePozaKontenerem = (zdarzenie: PointerEvent) => {
      if (!kontenerRef.current?.contains(zdarzenie.target as Node)) ustawOtwarty(false);
    };

    document.addEventListener('keydown', obsluzNacisniecieKlawisza);
    document.addEventListener('pointerdown', obsluzNacisnieciePozaKontenerem);
    return () => {
      document.removeEventListener('keydown', obsluzNacisniecieKlawisza);
      document.removeEventListener('pointerdown', obsluzNacisnieciePozaKontenerem);
    };
  }, [otwarty]);

  return <div className={`komunikat-funkcji ${klasaKontenera ?? ''}`} ref={kontenerRef}>
    <button type="button" className={klasaPrzycisku} aria-label={etykieta} aria-expanded={otwarty} aria-controls={identyfikatorKomunikatu} onClick={() => ustawOtwarty(obecny => !obecny)}>{children}</button>
    {otwarty && <div className="komunikat-funkcji__popover" id={identyfikatorKomunikatu} role="status"><b>{tytul}</b><p>{opis}</p></div>}
  </div>;
}
