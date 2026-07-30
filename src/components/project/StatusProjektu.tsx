import { useEffect, useMemo, useState } from 'react';
import type { Project } from '../../data/siteData';
import type { SzczegolyProjektu, StatusDojrzalosci } from '../../data/projectDetails';
import type { UprawnieniaUzytkownika } from '../../moduly/auth/uprawnienia';
import { pobierzStanDojrzalosci, zapiszStanDojrzalosci } from './logikaDojrzalosci';
import { ograniczPostep, pobierzKamieniePosrednie, pobierzWidocznePrzyszleEtapy, wyznaczStanyKamieni } from './logikaStatusu';

function wyznaczSugestie(szczegoly: SzczegolyProjektu): StatusDojrzalosci {
  return szczegoly.aktualizacje?.length ? 'Prototyp działający' : 'Koncepcja';
}

export function StatusProjektu({ projekt, szczegoly, uprawnienia }: { projekt:Project; szczegoly:SzczegolyProjektu; uprawnienia:UprawnieniaUzytkownika }) {
  const [dojrzalosc, ustawDojrzalosc] = useState(() => pobierzStanDojrzalosci(projekt.slug, szczegoly.dojrzalosc));
  const kamienie = useMemo(() => wyznaczStanyKamieni(projekt.status, szczegoly), [projekt.status, szczegoly]);
  const kolejne = useMemo(() => pobierzWidocznePrzyszleEtapy(szczegoly.przyszleEtapy, uprawnienia), [szczegoly.przyszleEtapy, uprawnienia]);
  const postep = ograniczPostep(projekt.progress);
  const sugestia = wyznaczSugestie(szczegoly);

  useEffect(() => {
    ustawDojrzalosc(pobierzStanDojrzalosci(projekt.slug, szczegoly.dojrzalosc));
  }, [projekt.slug, szczegoly.dojrzalosc]);

  const zmienDojrzalosc = (wartosc: StatusDojrzalosci, stanSugestii: 'zastosowana' | 'odrzucona') => {
    const nowyStan = { wartosc, sugestia:stanSugestii };
    ustawDojrzalosc(nowyStan);
    zapiszStanDojrzalosci(projekt.slug, nowyStan);
  };

  return <>
    <div className="metadane-projektu">
      <span>Status: <b>{projekt.status}</b></span>
      <span>Dojrzałość: <b>{dojrzalosc.wartosc}</b></span>
      <span>Start: {szczegoly.rozpoczecie}</span>
      <span>Aktualizacja: {szczegoly.aktualizacja}</span>
      <span>{szczegoly.obserwujacy} obserwujących</span>
    </div>
    <div className="postep-procentowy">
      <div><b>Postęp projektu</b><span>{postep}%</span></div>
      <div className="postep-procentowy__tor" role="progressbar" aria-label={`Postęp projektu: ${postep}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={postep}>
        <span style={{ width:`${postep}%` }}/>
      </div>
    </div>
    {kamienie.length > 0 && <div className="postep-statusow" aria-label={`Etapy projektu. Aktualny status: ${projekt.status}`}>
      <ol>{kamienie.map(kamien => {
        const posrednie = pobierzKamieniePosrednie(kamien, szczegoly);
        return <li key={kamien.id} className={kamien.stan}>
          <span className="postep-statusow__punkt"/>
          <b>{kamien.tytul}</b>
          {kamien.orientacyjny && <small>orientacyjnie</small>}
          {posrednie.length > 0 && <ul className="kamienie-posrednie">{posrednie.map(posredni => <li key={posredni.id}><span/>{posredni.tytul}{posredni.data && <time dateTime={posredni.data}>{posredni.data}</time>}</li>)}</ul>}
        </li>;
      })}</ol>
    </div>}
    <aside className="co-teraz">
      <span className="section-kicker">CO DZIEJE SIĘ TERAZ?</span>
      <b>{szczegoly.aktualnyEtap}</b>
      {szczegoly.aktualizacje?.[0] && <p>Ostatni postęp: {szczegoly.aktualizacje[0].tytul ?? szczegoly.aktualizacje[0].tresc}</p>}
      {kolejne.length > 0 && <div className="przyszle-etapy"><b>Najbliższe etapy</b><ul>{kolejne.map(etap => <li key={etap.id}><span>{etap.tytul}</span>{etap.opis && <p>{etap.opis}</p>}{etap.termin && <small>{etap.termin}</small>}</li>)}</ul></div>}
      {uprawnienia.widocznoscProjektu === 'guest' && szczegoly.przyszleEtapy?.length ? <small>Po zalogowaniu zobaczysz najbliższe planowane kroki.</small> : null}
    </aside>
    {uprawnienia.mozeEdytowacProjekt && dojrzalosc.sugestia === 'oczekujaca' && <aside className="sugestia-dojrzalosci">
      <b>Sugestia dojrzałości: {sugestia}</b>
      <span>To podpowiedź demonstratora. Nie zmienia głównego statusu projektu.</span>
      <button type="button" className="button compact" onClick={() => zmienDojrzalosc(sugestia, 'zastosowana')}>Zastosuj sugestię</button>
      <button type="button" className="button secondary compact" onClick={() => zmienDojrzalosc(dojrzalosc.wartosc, 'odrzucona')}>Odrzuć</button>
    </aside>}
  </>;
}
