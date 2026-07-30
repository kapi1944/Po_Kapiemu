CREATE TABLE IF NOT EXISTS uzytkownicy (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nazwa_wyswietlana TEXT NOT NULL,
  role TEXT[] NOT NULL DEFAULT ARRAY['uzytkownik'],
  hash_hasla TEXT NOT NULL,
  utworzono_o TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sesje (
  id UUID PRIMARY KEY,
  uzytkownik_id UUID NOT NULL REFERENCES uzytkownicy(id) ON DELETE CASCADE,
  hash_tokenu CHAR(64) NOT NULL UNIQUE,
  wygasa_o TIMESTAMPTZ NOT NULL,
  utworzono_o TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sesje_wygasa_o_idx ON sesje(wygasa_o);
