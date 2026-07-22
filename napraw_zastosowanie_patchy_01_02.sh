#!/usr/bin/env bash
set -euo pipefail

REPO="/c/GitHub/Projects/Po_Kapiemu"
STARE_REPO="/c/Users/madej/Documents/____GitHub_Projects/___Projekty_GitHub/Po_Kapiemu/Po_Kapiemu"

cd "$REPO"

echo "== Repo =="
pwd
git status --short
git switch main
git pull --ff-only origin main

# Nie kontynuuj, jeśli istnieją niezacommitowane zmiany w śledzonych plikach.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "BŁĄD: są niezacommitowane zmiany w śledzonych plikach. Niczego nie resetuję."
  git status --short
  exit 1
fi

znajdz_patch() {
  local nazwa="$1"
  if [[ -f "$REPO/$nazwa" ]]; then
    printf '%s' "$REPO/$nazwa"
  elif [[ -f "$STARE_REPO/$nazwa" ]]; then
    printf '%s' "$STARE_REPO/$nazwa"
  elif [[ -f "$HOME/Downloads/$nazwa" ]]; then
    printf '%s' "$HOME/Downloads/$nazwa"
  else
    echo "BŁĄD: nie znaleziono $nazwa" >&2
    exit 1
  fi
}

PATCH1="$(znajdz_patch 01_dodaj_zalaczniki_pomyslu.patch)"
PATCH2="$(znajdz_patch 02_zwieksz_czytelnosc_ui.patch)"

echo "== Patch 1: $PATCH1 =="
git apply --check "$PATCH1"
git apply "$PATCH1"

grep -q 'attachment-field' src/App.css
grep -q 'const \[pliki, ustawPliki\]' src/pages/MissingPages.tsx

npm run build
npm run lint
git diff --check

git add src/pages/MissingPages.tsx src/App.css
if git diff --cached --quiet; then
  echo "BŁĄD: patch 1 nie przygotował żadnych zmian do commitu. Zatrzymuję się."
  exit 1
fi
git commit -m "feat: dodaj zalaczniki do pomyslow"

echo "== Patch 2: $PATCH2 =="
git apply --check "$PATCH2"
git apply "$PATCH2"

grep -q -- '--font-micro' src/App.css

npm run build
npm run lint
git diff --check

git add src/App.css
if git diff --cached --quiet; then
  echo "BŁĄD: patch 2 nie przygotował żadnych zmian do commitu. Zatrzymuję się."
  exit 1
fi
git commit -m "style: zwieksz czytelnosc interfejsu"

echo
echo "== GOTOWE =="
git status --short
git log --oneline -5

echo
echo "Uruchom teraz: npm run dev"
echo "Po ręcznym sprawdzeniu: git push origin main"
