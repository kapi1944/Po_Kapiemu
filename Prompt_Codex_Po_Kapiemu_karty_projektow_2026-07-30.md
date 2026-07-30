# Prompt dla Codexa — Po Kapiemu: kompletne wdrożenie nowej podstrony projektu

Pracujesz w aktualnym repozytorium **`kapi1944/Po_Kapiemu`**, na bieżącej gałęzi projektu (docelowo `main`). Nie twórz nowych osobnych gałęzi.
lokalnie: C:\GitHub\Projects\Po_Kapiemu

## Cel

Wdróż do istniejącego frontendu wszystkie ustalenia dotyczące rozbudowy kart/podstron projektów opisane poniżej. Nie buduj osobnej aplikacji i nie przepisuj całego serwisu. Rozszerz aktualną architekturę React + TypeScript + Vite, zachowując istniejący wygląd, tokeny kolorów, routing, responsywność, motywy oraz funkcje strony.

Aktualny kod ma już:

- `src/pages/ProjectDetailPage.tsx` — bardzo prostą podstronę projektu,
- `src/data/siteData.ts` — podstawowy model `Project`,
- `src/components/ProjectCard.tsx` — karty projektów,
- `src/components/GuestLock.tsx` — gotowy wzorzec blokady dla gości,
- `src/components/DashboardPanels.tsx` i `src/pages/OtherPages.tsx` — demonstracyjne głosowania,
- `src/components/Icons.tsx` — wspólny zestaw ikon,
- `src/App.css`, `src/index.css`, `src/routes.css`, `src/readability.css` — istniejące style.

Repo korzysta z React 19, React Router, TypeScript i Vite. Nie ma backendu, prawdziwego auth ani biblioteki drag-and-drop. Nie dodawaj ciężkich zależności tylko po to, żeby zrealizować funkcje możliwe natywnie.

---

# Zasady pracy

1. **Nie zaczynaj od osobnego audytu, raportu, przeglądu całego repo ani od uruchamiania pełnego zestawu testów.**
2. Na początku wykonaj tylko minimalne:
   ```bash
   git status --short --branch
   ```
   To jest zabezpieczenie przed nadpisaniem cudzych zmian, a nie osobny etap audytu.
3. Nie resetuj, nie stashuj i nie usuwaj zmian użytkownika. Nie dotykaj plików niezwiązanych z wdrożeniem.
4. Czytaj odpowiednie pliki na początku danego etapu i od razu implementuj.
5. Nie twórz roboczych plików `.patch`, tymczasowych skryptów wdrożeniowych ani plików pomocniczych w repo.
6. Utrzymuj obecne nazewnictwo polskie tam, gdzie projekt już go używa.
7. Unikaj wielkiego komponentu `ProjectDetailPage.tsx`. Rozbij funkcje na małe komponenty i osobny model danych.
8. Nie rozbudowuj bez końca `siteData.ts`. Zostaw w nim lekki model potrzebny do list/kart, a szczegółowe dane projektu przenieś do dedykowanego modułu, np. `src/data/projectDetails.ts` i ewentualnie osobnego pliku typów.
9. Preferuj dedykowane style podstrony projektu, np. `src/pages/ProjectDetailPage.css` albo `src/components/project/project-detail.css`, zamiast dalszego pompowania `App.css`.
10. Zachowaj responsywność desktop/tablet/mobile oraz obsługę `prefers-reduced-motion`.
11. Wszystkie interaktywne kontrolki mają być dostępne z klawiatury i mieć poprawne `aria-label`, `aria-expanded`, `aria-pressed` itp.
12. Puste/opcjonalne sekcje nie mogą renderować pustych kart ani placeholderów.
13. Nie udawaj prawdziwego backendu. Funkcje wymagające konta, głosów, komentarzy, moderacji i kolejności sekcji zrealizuj jako **spójny demonstrator front-endowy** z modelami gotowymi do późniejszej migracji do backendu.
14. Tam, gdzie potrzebna jest trwałość demonstracyjna, używaj `localStorage` z wersjonowanymi, jednoznacznymi kluczami `pk-*`.
15. Ponieważ prawdziwego logowania jeszcze nie ma, utwórz jedną scentralizowaną warstwę roli widza:
    - `guest`
    - `registered`
    - `supporter`
    - `author`

    Domyślnie zachowaj publiczny widok gościa. Do testowania w development można użyć parametru URL lub małego selektora widocznego **wyłącznie w `import.meta.env.DEV`**. Nie rozrzucaj po kodzie kolejnych stałych typu `CZY_UZYTKOWNIK_ZALOGOWANY`.

16. Nie implementuj realnego logowania, serwera, bazy danych, płatności ani uploadu plików w tym zadaniu.
17. Nie wybieraj i nie narzucaj żadnej konkretnej licencji open-source.

---

# Ważna migracja statusów

Aktualny `ProjectStatus` używa m.in. `W trakcie`, `Testy`, `Aktywny`, `Zakończony`. Zastąp ten system docelowym:

## Główne statusy / główne kamienie milowe

- `Pomysł`
- `Planowanie`
- `Przygotowanie`
- `W realizacji`
- `Testowanie`
- `Dopracowywanie`
- `Ukończony`

## Statusy specjalne

- `Wstrzymany`
- `Porzucony`
- `Rozwijany dalej`

Semantyczna migracja istniejących danych:

- `W trakcie` → `W realizacji`
- `Testy` → `Testowanie`
- `Zakończony` → `Ukończony`
- obecne `Aktywny` przy projekcie, który nadal jest rozwijany i nie jest ukończony → `W realizacji`
- `Pomysł`, `Planowanie`, `Wstrzymany` zachowaj

Po zmianie znajdź wszystkie zależności od starych wartości, szczególnie:

- `src/data/siteData.ts`
- `src/components/DashboardPanels.tsx`
- `src/pages/ProjectsPage.tsx`
- wszystkie pozostałe wystąpienia `ProjectStatus`

Nie zostawiaj starych statusów jako martwych aliasów.

Osobno dodaj status dojrzałości aktualnego rezultatu:

- `Koncepcja`
- `Wczesny prototyp`
- `Prototyp działający`
- `Wersja testowa`
- `Wersja użytkowa`
- `Wersja stabilna`
- `Wersja finalna`

Status dojrzałości nie zastępuje głównego statusu projektu.

---

# ETAP 1 — Model danych i modułowa architektura podstrony projektu

## Cel etapu

Przygotuj fundament, na którym kolejne etapy będą dodawały realne sekcje.

### Wymagania

1. Zachowaj lekki `Project` dla list i `ProjectCard`.
2. Utwórz bogaty model szczegółów projektu, indeksowany po `slug`.
3. Model ma przewidywać co najmniej:
   - datę rozpoczęcia i ostatniej aktualizacji,
   - główne kamienie milowe/statusy,
   - pośrednie kamienie milowe,
   - status dojrzałości,
   - aktualny etap,
   - przyszłe etapy i ich poziom widoczności,
   - liczbę obserwujących,
   - aktualizacje,
   - galerię,
   - głosowania,
   - komentarze,
   - instrukcję budowy,
   - części i narzędzia,
   - kosztorys,
   - dokumentację,
   - materiały do pobrania,
   - repozytorium,
   - wersje,
   - nieudane eksperymenty,
   - FAQ,
   - ograniczenia,
   - „dla kogo / dla kogo nie”,
   - „lekcje na przyszłość”,
   - opcjonalne uzasadnienia decyzji,
   - projekty społeczności / relację z projektem źródłowym,
   - oznaczenie Open Source,
   - domyślną kolejność sekcji i sekcje wyróżnione.
4. Utwórz rejestr sekcji zamiast ręcznego, monolitycznego JSX.
5. `ProjectDetailPage.tsx` ma:
   - znaleźć projekt po `slug`,
   - pobrać jego dane szczegółowe,
   - zbudować listę faktycznie dostępnych sekcji,
   - ukryć sekcje bez danych,
   - renderować je zgodnie z kolejnością projektu.
6. Dodaj sticky nawigację po sekcjach. Kliknięcie przewija do odpowiedniej sekcji.
7. Aktywna pozycja sticky menu ma reagować na przewijanie, najlepiej przez `IntersectionObserver`.
8. Na mobile sticky menu może przewijać się poziomo zamiast łamać się w wiele wierszy.
9. Wydziel powtarzalny `ProjectSection`/`ProjectSectionShell` obsługujący tytuł, id, opcjonalne wyróżnienie i późniejsze kontrolki edycji.
10. Rozszerz `Icons.tsx` o brakujące ikony potrzebne w kolejnych etapach (np. chevron góra/dół, grip/drag, comment, thumbs up/down, flag, pin, fullscreen, previous/next) zamiast używać znaków Unicode jako protezy.

### Dane demonstracyjne

Nie musisz wypełnić każdej sekcji dla każdego projektu. Przygotuj bogaty komplet danych co najmniej dla jednego projektu (najlepiej `po-kapiemu` albo `asystent-bur`), a pozostałe niech pokazują, że sekcje są naprawdę opcjonalne.

### Zakończenie etapu

Uruchom:

```bash
npm run build
npm run lint
git diff --check
git status --short
```

Napraw błędy wynikające z tego etapu.

Następnie:

```bash
git add <tylko pliki etapu 1>
git commit -m "refactor: przygotuj architekture podstron projektow"
git status --short --branch
git push origin main
```

**Użytkownik wyraźnie zezwolił na push. Nie pytaj ponownie o zgodę. Po udanym pushu od razu przejdź do etapu 2.**

---

# ETAP 2 — Hero, postęp, statusy, kamienie milowe i dostęp do planów

## Hero projektu

1. Tytuł i krótki opis są głównym wprowadzeniem.
2. Nie twórz drugiego bloku „podsumowanie”.
3. Grafika ma być mniejsza i umieszczona obok opisu, a nie jako pełnoekranowy banner.
4. Pokaż datę rozpoczęcia i datę ostatniej aktualizacji.
5. Pokaż liczbę obserwujących.

## Pasek postępu + kamienie milowe

1. Połącz pasek postępu z głównymi statusami.
2. Każdy główny status jest głównym kamieniem milowym.
3. Stan aktualny jest wyraźnie zaznaczony.
4. Ukończone etapy, obecny etap i dostępne przyszłe etapy muszą być łatwo rozróżnialne.
5. Pośrednie ważne wydarzenia:
   - są mniejsze,
   - mają inny kształt lub ikonę,
   - nie mogą wyglądać jak pełny główny status.
6. Nie pokazuj czerwonych alarmów ani etykiet „opóźnione”.
7. Terminy planów pokazuj jako orientacyjne, jeśli dane takie istnieją.

## Poziomy dostępu do przyszłych etapów

- `guest`: nie widzi przyszłych etapów;
- `registered`: widzi maksymalnie 1-2 kolejne;
- `supporter`: widzi wszystkie;
- `author`: widzi wszystkie i może wejść w edycję.

Nie kopiuj zablokowanych tekstów do DOM jako łatwo czytelnej zawartości pod overlayem, jeśli mają być faktycznie ukryte. Dla treści ograniczonych rolą renderuj tylko to, co użytkownik ma prawo zobaczyć.

## „Co dzieje się teraz?”

Dodaj zwarty blok pokazujący:

- aktualny etap,
- ostatni ważny postęp,
- następny widoczny krok zgodnie z rolą widza,
- aktywne głosowanie, jeśli istnieje.

## Status dojrzałości

1. Pokaż go niezależnie od głównego statusu.
2. Dla autora system może wyliczyć prostą **sugestię** statusu na podstawie danych projektu.
3. Sugestia:
   - jest widoczna tylko autorowi,
   - nigdy nie zmienia stanu automatycznie,
   - ma przycisk „Zastosuj sugestię” / „Odrzuć”.
4. Dla demonstratora zapis decyzji autora może działać przez `localStorage`.

## Inne

- oznacz status `Porzucony`/`Wstrzymany`/`Ukończony` w sposób czytelny, ale nie agresywny,
- opcjonalnie pokaż poziom trudności i szacowany czas wykonania, jeśli dane są podane.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 2>
git commit -m "feat: rozbuduj statusy i postep projektow"
git status --short --branch
git push origin main
```

Po pushu od razu etap 3.

---

# ETAP 3 — Dziennik aktualizacji i galeria na osi czasu

## Dziennik aktualizacji

1. Osobna chronologiczna historia projektu.
2. Aktualizacja może zawierać:
   - tekst,
   - zdjęcia/grafiki,
   - film,
   - załączniki.
3. Tytuł aktualizacji jest opcjonalny.
4. „Co się zmieniło?” jest opcjonalne.
5. Pośrednie kamienie milowe mogą być osadzone na osi historii.
6. Nieudane eksperymenty:
   - pojawiają się we właściwym miejscu chronologii,
   - mogą być dodatkowo zebrane w osobnej sekcji,
   - mogą wskazywać późniejsze rozwiązanie przez id/link/anchor.

## Galeria

Układ ma być dokładnie:
**oś czasu → karuzela mediów wybranego etapu → duży podgląd wybranego medium**

### Oś czasu

- punkt reprezentuje datę wydarzenia/etapu,
- punkt ma krótki tytuł,
- może zawierać zdjęcia + grafiki + filmy razem,
- ma miniaturę reprezentatywną,
- miniatura/punkt ma widoczny border,
- aktywny punkt jest jednoznacznie zaznaczony.

### Karuzela

- pokazuje tylko media wybranego punktu,
- ma przyciski poprzedni/następny,
- obsługuje klawisze strzałek,
- obsługuje swipe/pointer gesture na mobile,
- zachowuje focus i nie kradnie globalnych klawiszy, gdy użytkownik pisze w polu formularza.

### Duży podgląd

- zdjęcie/grafika: pełny obraz z opcjonalnym podpisem,
- film: odtwarzacz/bezpieczny embed zależnie od typu danych,
- przycisk pełnego ekranu,
- dla obrazów można użyć natywnego `<dialog>`/lightboxu,
- ESC zamyka tryb pełnoekranowy.

### Zasada selekcji treści

Nie pokazuj automatycznie wszystkich `contentItems` powiązanych z projektem. Projekt ma jawnie wskazywać, które media są częścią galerii/prezentacji.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 3>
git commit -m "feat: dodaj historie i galerie projektow"
git status --short --branch
git push origin main
```

Po pushu od razu etap 4.

---

# ETAP 4 — Głosowania projektu i system komentarzy

## Głosowania projektu

### Widok

1. Domyślnie pokaż aktywne/bieżące głosowanie.
2. Użytkownik może rozwinąć panel i zobaczyć wszystkie głosowania projektu.
3. Bez filtrów i sortowania.
4. Głosowanie może mieć:
   - pytanie,
   - opis/uzasadnienie, dlaczego społeczność jest pytana,
   - opcje tekstowe,
   - opcjonalne obrazy przy opcjach,
   - stan aktywne/zakończone,
   - końcową decyzję autora.

### Oddawanie głosu

1. Głos oddaje się bez opuszczania strony projektu.
2. Przed głosem nie pokazuj wyników aktywnego głosowania.
3. Po głosie:
   - zapis wyboru,
   - brak możliwości zmiany,
   - pokaż wyniki.
4. Stan demonstracyjny utrwal w `localStorage` per `pollId`.
5. Zakończone głosowania pozostają dostępne bezterminowo w danych.
6. Wynik pokazuje jednocześnie:
   - liczbę głosów,
   - procent.
7. Po zakończeniu pokaż końcową opcję wybraną przez autora, jeśli została określona.

### Ujednolicenie istniejących głosowań

Aktualne `KartaGlosowania` i `PollsPage` mają zachowanie sprzeczne z nową zasadą (dashboard pokazuje wyniki od razu, a strona głosowania pozwala zmieniać wybór). Wyciągnij wspólną logikę/widget tam, gdzie jest to rozsądne, i spraw, aby istniejące demonstracyjne głosowania nie przeczyły nowym zasadom:

- brak wyników przed głosem,
- brak zmiany oddanego głosu.

Nie rozwal obecnej strony `/glosowania`.

---

## Komentarze

### Uprawnienia

- każdy może czytać publiczne komentarze,
- publikować może `registered`, `supporter`, `author`,
- `guest` widzi czytelny komunikat o konieczności zalogowania.

### Moderacja

1. Nowy komentarz zalogowanego użytkownika jest publikowany od razu, **chyba że** wykryje go filtr.
2. Utwórz prosty, łatwo rozszerzalny moduł filtra wulgaryzmów/obelg.
3. Komentarz trafiony przez filtr:
   - otrzymuje status `pending`,
   - nie jest publicznie widoczny,
   - autor widzi go w panelu moderacji,
   - autor może zatwierdzić lub odrzucić.
4. To jest demonstrator front-endowy; nie przedstawiaj go jako prawdziwej ochrony serwerowej.

### Wątki

- komentarz główny + maksymalnie 3 poziomy odpowiedzi,
- nie pozwól utworzyć odpowiedzi głębiej,
- odpowiedzi powinny wizualnie pokazywać hierarchię, ale nie robić coraz węższej kolumny bez końca.

### Reakcje i zgłoszenia

- łapka w górę + licznik,
- łapka w dół + licznik,
- zgłoszenie komentarza,
- autor może przypiąć komentarz,
- komentarz autora ma oznaczenie „Autor projektu”.

### Komentarze do kroków instrukcji

1. Każdy krok instrukcji może mieć swój composer komentarza.
2. Taki komentarz przechowuje kontekst kroku.
3. W sekcji danego kroku pokazuj komentarze dotyczące kroku.
4. W głównej sekcji komentarzy pokaż **wszystkie** komentarze chronologicznie.
5. Komentarz z kroku ma badge/link „Dotyczy kroku: …”.
6. Komentarz ogólny dodaje się w osobnym composerze bez kontekstu kroku.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 4>
git commit -m "feat: dodaj glosowania i komentarze projektow"
git status --short --branch
git push origin main
```

Po pushu od razu etap 5.

---

# ETAP 5 — Materiały, repozytorium, instrukcja, dokumentacja, części i koszty

## Materiały do pobrania

1. Zastąp obecną ogólną kartę „Materiały / pliki i publikacje” pełną sekcją projektu.
2. Kategorie plików, np.:
   - Dokumentacja
   - Schematy
   - Kod
   - Modele
   - Grafiki
   - Inne
3. Każdy plik może mieć:
   - id,
   - kategorię,
   - nazwę,
   - opis,
   - rozmiar,
   - wersję pliku,
   - zgodność z wersją projektu,
   - `downloadUrl` opcjonalny,
   - informację czy jest aktualny/starszy.
4. Starsze wersje pozostają widoczne, dopóki nie zostaną usunięte z danych.
5. Jeśli `downloadUrl` nie istnieje, nie twórz martwego linku — pokaż stan „plik nie został jeszcze dodany”.

### Dostęp

- `guest`: nie widzi nazw ani opisów plików;
- `guest`: widzi liczbę dostępnych materiałów + blokadę + komunikat w rodzaju:
  **„Dodatkowe materiały można pobierać po zalogowaniu.”**
- `registered`, `supporter`, `author`: pełna lista i aktywne linki, jeśli URL istnieje.

Wykorzystaj stylistycznie istniejący `GuestLock`, ale nie kopiuj ukrytej listy plików pod overlay.

## Repozytorium Git

- sekcja opcjonalna,
- pokaż nazwę, provider, URL i krótki opis,
- bezpieczny link z ikoną `external`,
- to samo repozytorium może być także reprezentowane jako pozycja/link w sekcji materiałów,
- nie duplikuj danych: oba miejsca mają korzystać z tego samego źródła/modelu.

## „Zbuduj sam”

Osobna sekcja tylko wtedy, gdy projekt ma instrukcję.

- kroki,
- tytuł + treść,
- zdjęcia/filmy,
- komentarze per krok (z etapu 4),
- opcjonalny szacowany czas całej budowy,
- opcjonalny poziom trudności,
- opcjonalne wymagania wstępne.

## Części i narzędzia

- osobne listy,
- element opcjonalny ma badge,
- możliwość wskazania tańszego i droższego zamiennika,
- nie dodawaj obowiązkowego linku zakupowego, jeśli nie ma go w danych.

## Kosztorys

- cały moduł jest opcjonalny,
- jeśli istnieje planowany kosztorys, pokaż plan vs faktyczne koszty,
- jeśli nie ma planu, pokaż tylko dane rzeczywiście dostępne,
- nie pokazuj pustych pól jako `0 zł`.

## Dokumentacja

- możliwość czytania na stronie,
- interaktywny spis treści z anchorami,
- podświetlenie aktywnej części mile widziane,
- sekcje opcjonalne:
  - „Dlaczego zrobiłem to właśnie tak?”
  - „Znane ograniczenia”
  - FAQ projektu
  - „Lekcje na przyszłość”
  - „Dla kogo / dla kogo nie”

Puste sekcje znikają.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 5>
git commit -m "feat: dodaj materialy i dokumentacje projektow"
git status --short --branch
git push origin main
```

Po pushu od razu etap 6.

---

# ETAP 6 — Wersje, Open Source i projekty społeczności

## Wersje

1. Projekt może mieć `v1`, `v2`, `v3` itd.
2. Każda wersja:
   - nazwa/numer,
   - data,
   - status dojrzałości,
   - krótki changelog.
3. Przy projekcie programistycznym może istnieć link do pełnego changelogu, ale nie jest wymagany.
4. Dodaj prostą sekcję:
   **„Co zmieniło się względem poprzedniej wersji”**
   zamiast technicznego diffu linia po linii.
5. Materiały do pobrania mogą wskazywać zgodną wersję projektu.

## Open Source

- opcjonalny badge `Open Source`,
- pole licencji może być przygotowane jako opcjonalne na przyszłość,
- **nie ustawiaj żadnej konkretnej licencji i nie wymuszaj jej teraz**.

## Projekty społeczności

Model musi obsłużyć:

- projekt oryginalny,
- rozwinięcie,
- modyfikację,
- alternatywną wersję,
- niezależny „Autorski projekt”.

### Projekt będący rozwinięciem

Na jego stronie pokaż:

- badge typu relacji,
- link do projektu oryginalnego.

### Projekt oryginalny

Na końcu strony pokaż wszystkie znane rozwinięcia jako karty zawierające:

- miniaturę,
- autora,
- krótki opis,
- status,
- typ relacji,
- link do projektu.

Nie buduj osobnego routingu, jeśli obecne `/projekty/:slug` wystarcza.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 6>
git commit -m "feat: dodaj wersje i projekty spolecznosci"
git status --short --branch
git push origin main
```

Po pushu od razu etap 7.

---

# ETAP 7 — Tryb edycji autora, kolejność sekcji i końcowa integracja UX

## Tryb edycji

Dostępny tylko dla roli `author`.

Dodaj przycisk przejścia do trybu edycji układu podstrony.

### Kontrolki każdej sekcji

W prawym górnym rogu sekcji w trybie edycji:

- strzałka w górę,
- pośrodku uchwyt `grip` do przeciągania,
- strzałka w dół.

#### Strzałki

- przesuwają sekcję dokładnie o jedną pozycję,
- pierwsza sekcja ma wyłączoną strzałkę w górę,
- ostatnia ma wyłączoną strzałkę w dół.

#### Drag and drop

- przeciąganie działa za uchwyt,
- sekcję można przenieść przez wszystkie pozostałe,
- pozycja zapisuje się po puszczeniu,
- użyj natywnego HTML drag/pointer rozwiązania; nie dodawaj dużej biblioteki,
- na urządzeniach, gdzie drag jest niewygodny, strzałki pozostają pełnym fallbackiem.

### Trwałość

Dla MVP kolejność zapisuj w `localStorage` osobno dla każdego `project.slug`.
Dane projektu definiują kolejność domyślną.

### Wyróżnianie sekcji

Autor może oznaczyć jedną lub kilka sekcji jako wyróżnione.

- wyróżnienie ma być subtelne,
- użyj istniejącej rodziny koloru kategorii projektu,
- nie rób krzykliwego pełnego tła,
- stan może być zapisany lokalnie w demonstratorze.

## Końcowa integracja

1. Sprawdź, czy nowe statusy nie zepsuły:
   - listy projektów,
   - filtrów,
   - dashboardu,
   - liczników statusów.
2. Sprawdź, czy `ProjectCard` nadal działa i nadal prowadzi do podstrony.
3. Nie wyświetlaj pustych sekcji.
4. Sticky menu zawiera tylko sekcje faktycznie renderowane.
5. Widoki ról nie ujawniają niedozwolonych danych.
6. Zadbaj o focus styles, reduced motion i klawiaturę.
7. Nie zmieniaj niepotrzebnie globalnego designu Po Kapiemu.

### Zakończenie etapu

```bash
npm run build
npm run lint
git diff --check
git status --short
git add <tylko pliki etapu 7>
git commit -m "feat: dopracuj edycje i nawigacje projektow"
git status --short --branch
git push origin main
```

---

# Końcowa kontrola po wszystkich 7 etapach

Po ostatnim pushu wykonaj:

```bash
git status --short --branch
git log --oneline -8
```

Jeżeli drzewo nie jest czyste, wyjaśnij dokładnie dlaczego i nie kasuj niczego automatycznie.

Następnie podaj użytkownikowi krótkie podsumowanie:

1. co wdrożono,
2. jakie nowe komponenty/model danych powstały,
3. jak przełączyć rolę demonstracyjną w trybie development,
4. siedem commitów i ich SHA,
5. potwierdzenie, że każdy commit został wypchnięty,
6. czy `npm run build`, `npm run lint` i `git diff --check` przeszły na każdym etapie,
7. jakie elementy nadal wymagają prawdziwego backendu/auth w przyszłości.

---

# Kryteria akceptacji całego wdrożenia

Wdrożenie uznaj za kompletne dopiero wtedy, gdy:

- podstrona projektu nie jest już czterema statycznymi kartami,
- nowe sekcje są modularne i sterowane danymi,
- puste sekcje znikają,
- główne statusy są kamieniami milowymi na pasku postępu,
- istnieje niezależny status dojrzałości,
- przyszłe etapy są ograniczone wg `guest / registered / supporter`,
- działa dziennik aktualizacji,
- działa galeria `oś czasu → karuzela → podgląd`,
- galeria ma klawiaturę, przyciski, swipe i fullscreen,
- głosowanie ukrywa wyniki przed głosem i blokuje zmianę wyboru,
- archiwalne głosowania pokazują liczbę + procent,
- działa komentowanie z maks. 3 poziomami odpowiedzi,
- działa filtr demonstracyjny + kolejka moderacji autora,
- działają łapki, zgłoszenia i przypinanie,
- komentarze kroków trafiają również do globalnego feedu z oznaczeniem,
- materiały są zablokowane dla gościa bez ujawniania nazw,
- gość widzi liczbę plików i komunikat o logowaniu,
- działa podział materiałów na kategorie i zgodność wersji,
- repozytorium jest sekcją i może być linkiem w materiałach,
- instrukcja, dokumentacja, części, koszty, FAQ, ograniczenia itd. są opcjonalne,
- dokumentacja ma interaktywny spis,
- wersje mają changelog i „co zmieniło się względem poprzedniej”,
- Open Source jest opcjonalnym oznaczeniem bez narzuconej licencji,
- projekty społeczności mają relację do oryginału,
- oryginalny projekt pokazuje rozwinięcia na końcu,
- autor może zmieniać kolejność sekcji strzałkami i drag handle,
- autor może wyróżniać sekcje,
- kolejność sekcji jest zapamiętywana per projekt,
- istniejące strony, motywy i routing nadal działają,
- build, lint i `git diff --check` są poprawne.

Nie zatrzymuj się po napisaniu planu lub częściowej implementacji. Wykonaj kolejno wszystkie siedem etapów, commit + push po każdym, korzystając z udzielonej zgody na push.
