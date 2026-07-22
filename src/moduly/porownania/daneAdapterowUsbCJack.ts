import type { AdapterUsbCJack, KolumnaPorownania, KategoriaPorownania, ParametryAdapteraUsbCJack } from './typyPorownan';

export const adapteryUsbCJack: AdapterUsbCJack[] = [
  {
    id: 'fiio-ka11',
    producent: 'FiiO',
    model: 'KA11',
    typ: 'dac',
    cena: null,
    ocena: 8.8,
    miniatura: null,
    werdykt: 'Mały DAC z dużym zapasem mocy.',
    rekomendacje: [],
    dlaKogo: null,
    dlaKogoNie: null,
    parametry: {
      dacChip: null,
      obslugaMikrofonu: null,
      maksymalnePcm: null,
      mocPrzy32Omach: null,
      obslugiwanaImpedancjaSluchawek: null,
      przyciski: null,
      android: null,
      windows: null,
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
  { id: 'produkt', etykieta: 'Produkt', pobierzWartosc: produkt => `${produkt.producent} ${produkt.model}` },
  { id: 'typ', etykieta: 'Typ', pobierzWartosc: produkt => produkt.typ === 'dac' ? 'DAC' : 'Adapter' },
  { id: 'dac-chip', etykieta: 'DAC / chip', pobierzWartosc: produkt => produkt.parametry.dacChip },
  { id: 'mikrofon', etykieta: 'Mikrofon', pobierzWartosc: produkt => produkt.parametry.obslugaMikrofonu },
  { id: 'pcm', etykieta: 'Maks. PCM', pobierzWartosc: produkt => produkt.parametry.maksymalnePcm },
  { id: 'moc-32-om', etykieta: 'Moc przy 32 Ω', pobierzWartosc: produkt => produkt.parametry.mocPrzy32Omach },
  { id: 'impedancja', etykieta: 'Impedancja słuchawek', pobierzWartosc: produkt => produkt.parametry.obslugiwanaImpedancjaSluchawek },
  { id: 'przyciski', etykieta: 'Przyciski', pobierzWartosc: produkt => produkt.parametry.przyciski },
  { id: 'android', etykieta: 'Android', pobierzWartosc: produkt => produkt.parametry.android },
  { id: 'windows', etykieta: 'Windows', pobierzWartosc: produkt => produkt.parametry.windows },
  { id: 'cena', etykieta: 'Cena', pobierzWartosc: produkt => produkt.cena ? `${produkt.cena.kwota} ${produkt.cena.waluta}` : null },
  { id: 'ocena', etykieta: 'Ocena', pobierzWartosc: produkt => produkt.ocena === null ? null : `${produkt.ocena} / 10` },
  { id: 'snr', etykieta: 'SNR', pobierzWartosc: produkt => produkt.parametry.snrDb === null || produkt.parametry.snrDb === undefined ? null : `${produkt.parametry.snrDb} dB` },
  { id: 'thd-n', etykieta: 'THD+N', pobierzWartosc: produkt => produkt.parametry.thdN },
  { id: 'werdykt', etykieta: 'Werdykt', pobierzWartosc: produkt => produkt.werdykt },
  { id: 'dla-kogo', etykieta: 'Dla kogo', pobierzWartosc: produkt => produkt.dlaKogo },
  { id: 'dla-kogo-nie', etykieta: 'Dla kogo nie', pobierzWartosc: produkt => produkt.dlaKogoNie },
];
