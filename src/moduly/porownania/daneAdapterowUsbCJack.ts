import type { AdapterUsbCJack, KategoriaPorownania, ParametryAdapteraUsbCJack } from './typyPorownan';

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

export const porownanieAdapterowUsbCJack: KategoriaPorownania<ParametryAdapteraUsbCJack> = {
  id: 'adaptery-usb-c-jack',
  slug: 'adaptery-usb-c-jack',
  nazwa: 'Adaptery i małe DAC USB-C → jack 3,5 mm',
  opis: 'Porównanie kompaktowych adapterów i DAC-ów do słuchawek przewodowych.',
  produkty: adapteryUsbCJack,
};
