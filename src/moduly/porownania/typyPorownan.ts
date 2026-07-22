export type CenaProduktu = {
  kwota: number;
  waluta: string;
};

export type ProduktPorownania<TParametry> = {
  id: string;
  producent: string;
  model: string;
  typ: string;
  cena: CenaProduktu | null;
  ocena: number | null;
  miniatura: string | null;
  werdykt: string | null;
  dlaKogo: string | null;
  dlaKogoNie: string | null;
  parametry: TParametry;
};

export type KategoriaPorownania<TParametry, TProdukt extends ProduktPorownania<TParametry> = ProduktPorownania<TParametry>> = {
  id: string;
  slug: string;
  nazwa: string;
  opis: string;
  produkty: TProdukt[];
  ostatniaAktualizacja?: string;
};

export type TypAdapteraUsbCJack = 'adapter' | 'dac';

export type ParametryAdapteraUsbCJack = {
  dacChip: string | null;
  obslugaMikrofonu: boolean | null;
  maksymalnePcm: string | null;
  mocPrzy32Omach: string | null;
  obslugiwanaImpedancjaSluchawek: string | null;
  przyciski: boolean | null;
  android: boolean | null;
  windows: boolean | null;
  snrDb?: number | null;
  thdN?: string | null;
};

export type AdapterUsbCJack = ProduktPorownania<ParametryAdapteraUsbCJack> & {
  typ: TypAdapteraUsbCJack;
};

export type WartoscPorownania = string | number | boolean | null | undefined;

export type KolumnaPorownania<TProdukt> = {
  id: string;
  etykieta: string;
  pobierzWartosc: (produkt: TProdukt) => WartoscPorownania;
};
