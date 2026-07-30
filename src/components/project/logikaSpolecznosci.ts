import { projects } from '../../data/siteData';
import { szczegolyProjektow, type SzczegolyProjektu } from '../../data/projectDetails';

export function pobierzRozwinieciaProjektu(slug: string) {
  return projects.filter(projekt => szczegolyProjektow[projekt.slug]?.relacja?.projektZrodlowySlug === slug);
}

export function czyProjektMaSpolecznosc(szczegoly: SzczegolyProjektu) {
  return Boolean(szczegoly.relacja?.projektZrodlowySlug || pobierzRozwinieciaProjektu(szczegoly.slug).length);
}
