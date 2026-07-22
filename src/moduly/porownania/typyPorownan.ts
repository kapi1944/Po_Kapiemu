export type EtykietaRekomendacjiProduktu = 'best-quality' | 'best-value' | 'best-phone' | 'budget';

export const etykietyRekomendacjiProduktow: Record<EtykietaRekomendacjiProduktu, string> = {
  'best-quality': 'Najlepsza jakość',
  'best-value': 'Najlepszy stosunek ceny do jakości',
  'best-phone': 'Najlepszy do telefonu',
  budget: 'Budżetowy wybór',
};

export type TypZrodlaDanych = 'producent' | 'po-kapiemu' | 'inne-zweryfikowane';

export type ZrodloDanych = {
  typ: TypZrodlaDanych;
  nazwa: string;
  url?: string;
};

export type WpisZrodlowy<T> = {
  wartosc: T;
  zrodlo: ZrodloDanych;
};

export type ZakresLiczbowy = {
  min: number;
  max: number;
};

export type WartoscTechniczna = string | number | boolean | ZakresLiczbowy;

export type ParametrZrodlowy<T extends WartoscTechniczna = WartoscTechniczna> = {
  producent?: WpisZrodlowy<T>;
  pomiarPoKapiemu?: WpisZrodlowy<T>;
  inne?: WpisZrodlowy<T>[];
  powodBraku?: string;
};

export type CenaProduktu = {
  kwota: number;
  waluta: string;
  zrodlo?: ZrodloDanych;
};

export type StatusRelacjiAutoraZProduktem = 'do-weryfikacji' | 'posiadam' | 'testowalem';

export type RekomendacjeProduktu = {
  sugestieSystemu: EtykietaRekomendacjiProduktu[];
  zatwierdzonePrzezAutora: EtykietaRekomendacjiProduktu[];
};

export type ProduktPorownania<TParametry> = {
  id: string;
  producent: string;
  model: string;
  typ: string;
  relacjaAutora: StatusRelacjiAutoraZProduktem;
  cena: CenaProduktu | null;
  ocena: number | null;
  miniatura: string | null;
  werdykt: string | null;
  rekomendacje: RekomendacjeProduktu;
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
  dacChip: ParametrZrodlowy<string>;
  obslugaMikrofonu: ParametrZrodlowy<boolean>;
  maksymalnePcm: ParametrZrodlowy<string>;
  mocPrzy32OmachMw: ParametrZrodlowy<number>;
  obslugiwanaImpedancjaSluchawekOhm: ParametrZrodlowy<ZakresLiczbowy>;
  przyciski: ParametrZrodlowy<boolean>;
  android: ParametrZrodlowy<boolean>;
  windows: ParametrZrodlowy<boolean>;
  snrDb: ParametrZrodlowy<number>;
  thdNPercent: ParametrZrodlowy<number>;
};

export type AdapterUsbCJack = ProduktPorownania<ParametryAdapteraUsbCJack> & {
  typ: TypAdapteraUsbCJack;
};

export type WartoscPorownania = string | number | boolean | null | undefined | ParametrZrodlowy;

export type KolumnaPorownania<TProdukt> = {
  id: string;
  etykieta: string;
  obowiazkowa?: boolean;
  jednostka?: string;
  pobierzWartosc: (produkt: TProdukt) => WartoscPorownania;
};
