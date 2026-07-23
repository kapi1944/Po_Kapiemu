#!/usr/bin/env bash
set -euo pipefail

REPO="/c/GitHub/Projects/Po_Kapiemu"
cd "$REPO"

znajdz_patch() {
  local nazwa="$1"
  if [[ -f "$REPO/$nazwa" ]]; then
    printf '%s' "$REPO/$nazwa"
  elif [[ -f "$HOME/Downloads/$nazwa" ]]; then
    printf '%s' "$HOME/Downloads/$nazwa"
  else
    echo "BŁĄD: nie znaleziono $nazwa" >&2
    exit 1
  fi
}

echo "== Stan repo =="
git switch main
git pull --ff-only origin main

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "BŁĄD: są niezacommitowane zmiany w śledzonych plikach. Niczego nie resetuję."
  git status --short
  exit 1
fi

PATCH1="$(znajdz_patch 01b_dodaj_zalaczniki_bez_App_css.patch)"
PATCH2="$(znajdz_patch 02b_zwieksz_czytelnosc_bez_App_css.patch)"

echo "== 01b: załączniki =="
git apply --check "$PATCH1"
git apply "$PATCH1"
npm run build
npm run lint
git diff --check
git add src/pages/MissingPages.tsx src/pages/MissingPages.css
git commit -m "feat: dodaj zalaczniki do pomyslow"

echo "== 02b: czytelność =="
git apply --check "$PATCH2"
git apply "$PATCH2"
npm run build
npm run lint
git diff --check
git add src/App.tsx src/readability.css
git commit -m "style: zwieksz czytelnosc interfejsu"

echo
echo "== GOTOWE =="
git status --short
git log --oneline -6

echo
echo "Uruchom: npm run dev"
echo "Po sprawdzeniu: git push origin main"
