import type { AdapterUsbCJack, KolumnaPorownania, KategoriaPorownania, ParametrZrodlowy, ParametryAdapteraUsbCJack, WartoscTechniczna } from './typyPorownan';

const brakDanych = <T extends WartoscTechniczna>(powodBraku: string): ParametrZrodlowy<T> => ({ powodBraku });
const brakWeryfikacji = 'Brak zweryfikowanej wartości. Uzupełnij ją dopiero po sprawdzeniu źródła lub własnym pomiarze.';

export const adapteryUsbCJack: AdapterUsbCJack[] = [
  {
    id: 'fiio-ka11',
    producent: 'FiiO',
    model: 'KA11',
    typ: 'dac',
    relacjaAutora: 'do-weryfikacji',
    cena: null,
    ocena: 8.8,
    miniatura: null,
    werdykt: 'Mały DAC z dużym zapasem mocy.',
    rekomendacje: { sugestieSystemu: [], zatwierdzonePrzezAutora: [] },
    dlaKogo: null,
    dlaKogoNie: null,
    parametry: {
      dacChip: brakDanych<string>(brakWeryfikacji),
      obslugaMikrofonu: brakDanych<boolean>(brakWeryfikacji),
      maksymalnePcm: brakDanych<string>(brakWeryfikacji),
      mocPrzy32OmachMw: brakDanych<number>(brakWeryfikacji),
      obslugiwanaImpedancjaSluchawekOhm: brakDanych(brakWeryfikacji),
      przyciski: brakDanych<boolean>(brakWeryfikacji),
      android: brakDanych<boolean>(brakWeryfikacji),
      windows: brakDanych<boolean>(brakWeryfikacji),
      snrDb: brakDanych<number>(brakWeryfikacji),
      thdNPercent: brakDanych<number>(brakWeryfikacji),
    },
  },
];

export const porownanieAdapterowUsbCJack: KategoriaPorownania<ParametryAdapteraUsbCJack, AdapterUsbCJack> = {
  id: 'adaptery-usb-c-jack',
  slug: 'adaptery-usb-c-jack',
  nazwa: 'Adaptery i małe DAC USB-C → jack 3,5 mm',
  opis: 'Porównanie kompaktowych adapterów i DAC-ów do słuchawek przewodowych.',
  produkty: adapteryUsbCJack,
};

export const kolumnyAdapterowUsbCJack: KolumnaPorownania<AdapterUsbCJack>[] = [
  { id: 'produkt', etykieta: 'Produkt', obowiazkowa: true, pobierzWartosc: produkt => `${produkt.producent} ${produkt.model}` },
  { id: 'typ', etykieta: 'Typ', obowiazkowa: true, pobierzWartosc: produkt => produkt.typ === 'dac' ? 'DAC' : 'Adapter' },
  { id: 'dac-chip', etykieta: 'DAC / chip', pobierzWartosc: produkt => produkt.parametry.dacChip },
  { id: 'mikrofon', etykieta: 'Mikrofon', pobierzWartosc: produkt => produkt.parametry.obslugaMikrofonu },
  { id: 'pcm', etykieta: 'Maks. PCM', pobierzWartosc: produkt => produkt.parametry.maksymalnePcm },
  { id: 'moc-32-om', etykieta: 'Moc przy 32 Ω', jednostka: 'mW', pobierzWartosc: produkt => produkt.parametry.mocPrzy32OmachMw },
  { id: 'impedancja', etykieta: 'Impedancja słuchawek', jednostka: 'Ω', pobierzWartosc: produkt => produkt.parametry.obslugiwanaImpedancjaSluchawekOhm },
  { id: 'przyciski', etykieta: 'Przyciski', pobierzWartosc: produkt => produkt.parametry.przyciski },
  { id: 'android', etykieta: 'Android', pobierzWartosc: produkt => produkt.parametry.android },
  { id: 'windows', etykieta: 'Windows', pobierzWartosc: produkt => produkt.parametry.windows },
  { id: 'cena', etykieta: 'Cena', pobierzWartosc: produkt => produkt.cena ? `${produkt.cena.kwota} ${produkt.cena.waluta}` : null },
  { id: 'ocena', etykieta: 'Ocena', pobierzWartosc: produkt => produkt.ocena === null ? null : `${produkt.ocena} / 10` },
  { id: 'snr', etykieta: 'SNR', jednostka: 'dB', pobierzWartosc: produkt => produkt.parametry.snrDb },
  { id: 'thd-n', etykieta: 'THD+N', jednostka: '%', pobierzWartosc: produkt => produkt.parametry.thdNPercent },
  { id: 'werdykt', etykieta: 'Werdykt', pobierzWartosc: produkt => produkt.werdykt },
  { id: 'dla-kogo', etykieta: 'Dla kogo', pobierzWartosc: produkt => produkt.dlaKogo },
  { id: 'dla-kogo-nie', etykieta: 'Dla kogo nie', pobierzWartosc: produkt => produkt.dlaKogoNie },
];
