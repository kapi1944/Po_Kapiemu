# Po Kapiemu — MVP

Po Kapiemu to portal prezentujący rozwijane projekty: ich aktualny stan, postęp, materiały, decyzje i historię prac. Aplikacja łączy frontend React z serwerowym logowaniem opartym o Express, PostgreSQL i sesje w bezpiecznych ciasteczkach.

## Aktualne możliwości

Frontend udostępnia:

- listę i rozbudowane karty projektów,
- statusy, procentowy postęp, kamienie główne i pośrednie,
- przyszłe etapy zależne od uprawnień,
- dojrzałość projektu z lokalnie zapisywaną sugestią,
- aktualizacje, galerie obrazów i filmów, pliki oraz instrukcje „Zbuduj sam”,
- części, narzędzia, kosztorys, dokumentację, repozytorium i wersje,
- opcjonalne sekcje FAQ, ograniczeń, lekcji, decyzji i eksperymentów,
- lokalne komentarze projektów i kroków instrukcji,
- lokalne głosowania rozdzielone według projektu i użytkownika,
- responsywny układ oraz tryb demonstracyjnej edycji kolejności sekcji dla uprawnionych ról.

Backend udostępnia logowanie, odczyt sesji, wylogowanie oraz endpoint zdrowia. Hasła są hashowane przez bcrypt, a w bazie przechowywany jest wyłącznie hash tokenu sesji SHA-256.

## Wymagania

- Node.js 22 lub nowszy,
- npm,
- PostgreSQL 16 do uruchomienia bez Dockera albo Docker z Docker Compose,
- w produkcji: domena wskazująca na serwer oraz dostępne porty 80 i 443.

## Uruchomienie bez Dockera

1. Zainstaluj zależności:

```powershell
npm ci
```

2. Skopiuj `.env.przyklad` do `.env` i ustaw co najmniej `DATABASE_URL`.
3. Utwórz schemat:

```powershell
psql "$env:DATABASE_URL" -f server/baza.sql
```

4. Utwórz użytkownika. Hasło jest pobierane dwukrotnie w interaktywnym terminalu i nie może być przekazane jako argument:

```powershell
npm run uzytkownik:utworz -- admin@example.com "Administrator" administrator
```

5. Uruchom backend:

```powershell
npm run serwer
```

6. W drugim terminalu uruchom frontend:

```powershell
npm run dev
```

Vite przekazuje wywołania `/api` do backendu na porcie 3000.

## Role i uprawnienia

Dozwolone role backendowe:

- `widz` — odczyt treści dla zalogowanych, bez publikowania komentarzy i głosowania,
- `uzytkownik` — komentowanie i głosowanie,
- `wspierajacy` — jak użytkownik oraz dostęp do wszystkich przyszłych etapów,
- `moderator` — komentowanie, głosowanie i moderacja,
- `redaktor` — dostęp autora i edycja demonstracyjnych treści, bez automatycznej moderacji,
- `administrator` — edycja i moderacja,
- `wlasciciel` — pełne uprawnienia autora.

Wiele ról łączy swoje uprawnienia. Parametr `?rola=` działa tylko jako jawne narzędzie demonstracyjne w trybie deweloperskim i jest ignorowany w buildzie produkcyjnym.

## Logowanie i sesje

- odpowiedź dla nieistniejącego konta i błędnego hasła jest taka sama,
- logowanie ma limit 10 prób na 15 minut,
- token sesji jest losowy i trafia do ciasteczka `HttpOnly`, `SameSite=Strict`,
- ciasteczko ma atrybut `Secure` w produkcji i ścieżkę `/api`,
- w PostgreSQL zapisywany jest wyłącznie hash tokenu,
- nieprawidłowa lub wygasła sesja czyści ciasteczko,
- wylogowanie usuwa tylko bieżącą sesję,
- odpowiedzi autoryzacji nie są buforowane,
- produkcyjne żądania modyfikujące stan sprawdzają zgodność `Origin` z hostem.

Skrypt tworzenia użytkownika wymaga terminala TTY. Hasło musi mieć co najmniej 12 znaków i maksymalnie 72 bajty UTF-8.

## Docker Compose i HTTPS

1. Skopiuj `.env.przyklad` do `.env`.
2. Ustaw silne `POSTGRES_PASSWORD` oraz `DOMENA` bez prefiksu `https://`.
3. Sprawdź konfigurację i zbuduj usługi:

```powershell
docker compose config
docker compose build
docker compose up -d
```

PostgreSQL nie jest wystawiany publicznie. Aplikacja czeka na zdrową bazę, a Caddy na zdrowy endpoint `/api/health`.

Caddy może automatycznie uzyskać certyfikat TLS dopiero dla prawdziwej domeny z poprawnym DNS i publicznie dostępnymi portami 80 oraz 443. Lokalny adres nie wystarcza do wydania publicznego certyfikatu.

## Testy i kontrola jakości

```powershell
npm run check:encoding
npm run lint
npm run test
npm run build
npm run check:server
```

Testy Vitest obejmują czystą logikę kart projektów, komponenty React oraz API Express z kontrolowaną fałszywą pulą bazy. Nie wymagają prawdziwego PostgreSQL. Te same kontrole uruchamia workflow GitHub Actions dla każdego push i pull requestu.

## Ograniczenia wersji demonstracyjnej

- komentarze, reakcje, głosy, ustawienia dojrzałości i układu są zapisywane lokalnie w przeglądarce,
- logowanie i sesja są serwerowe,
- moduły „Moje projekty”, „Obserwowane”, „Zapisane” i „Moja aktywność” pozostają placeholderami,
- nie ma publicznej rejestracji ani resetowania hasła,
- nie ma logowania zewnętrznego, wysyłki e-maili ani płatności,
- nie ma panelu administracyjnego ani pełnego CMS,
- nie ma uploadu plików na serwer ani integracji z GitHub API.
