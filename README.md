# Po Kapiemu — MVP 0.1

Aplikacja React + Vite z backendem logowania opartym o Express i PostgreSQL.

## Lokalne uruchomienie

1. Skopiuj `.env.przyklad` do `.env` i ustaw lokalny `DATABASE_URL`.
2. Utwórz schemat bazy: `psql "$env:DATABASE_URL" -f server/baza.sql`.
3. Utwórz pierwsze konto (hasło nie zostaje zapisane w terminalu ani w pliku):

```powershell
npm run uzytkownik:utworz -- admin@example.com "Administrator" "dlugie-losowe-haslo" administrator
```

4. Uruchom backend: `npm run serwer`.
5. W drugim terminalu uruchom frontend: `npm run dev`.

Vite przekazuje wywołania `/api` do backendu na porcie 3000.

## Bezpieczeństwo logowania

- Hasła są jednokierunkowo hashowane przez bcrypt z kosztem co najmniej 12; nie są szyfrowane odwracalnie ani wysyłane do frontendu.
- Sesja jest losowym tokenem w ciasteczku `HttpOnly`, `SameSite=Strict`; w bazie zapisany jest wyłącznie hash tokenu.
- Logowanie ma limit 10 prób na 15 minut, a odpowiedź dla nieistniejącego konta i błędnego hasła jest taka sama.
- Żadne konto ani hasło testowe nie znajduje się w kodzie aplikacji.

## HTTPS i certyfikat SSL

Wdrożenie produkcyjne jest przygotowane w `docker-compose.yml`. Caddy automatycznie pobiera i odnawia certyfikat Let's Encrypt oraz przekierowuje HTTP na HTTPS.

1. Ustaw rekord DNS domeny na publiczny adres serwera.
2. Skopiuj `.env.przyklad` do `.env`, ustaw `DOMENA` bez `https://` oraz silne hasło PostgreSQL.
3. Na serwerze otwórz porty 80 i 443, następnie wykonaj `docker compose up -d --build`.
4. Utwórz konto administracyjne wewnątrz kontenera aplikacji lub przez bezpieczne połączenie z bazą.

Prawdziwego certyfikatu nie można wystawić lokalnie: urząd certyfikacji musi potwierdzić kontrolę nad wskazaną domeną i dostępność portów 80/443.
