#!/usr/bin/env bash
set -euo pipefail

REPO="/c/GitHub/Projects/Po_Kapiemu"
cd "$REPO"

echo "== Naprawa 01b po częściowym zastosowaniu =="

# 01b: jeżeli TSX nie został jeszcze zmieniony, zastosuj patch.
if ! grep -q "const \[pliki, ustawPliki\]" src/pages/MissingPages.tsx; then
  git apply --check 01b_dodaj_zalaczniki_bez_App_css.patch
  git apply 01b_dodaj_zalaczniki_bez_App_css.patch
fi

# Poprzedni patch omyłkowo nie zawierał tworzenia tego pliku.
cat > src/pages/MissingPages.css <<'EOF'
/* Załączniki w formularzu Dodaj pomysł */
.attachment-field { gap: 8px !important; }
.attachment-label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.attachment-label-row small { color: var(--muted); font-size: 10px; font-weight: 600; }

.attachment-picker {
  position: relative;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed var(--strong-line);
  border-radius: 10px;
  padding: 14px;
  background: var(--panel-2);
  color: var(--muted-strong);
  text-align: center;
  cursor: pointer;
  transition: border-color 160ms ease-out, background 160ms ease-out, color 160ms ease-out;
}
.attachment-picker:hover { border-color: var(--brand); background: var(--brand-subtle); color: var(--brand-strong); }
.attachment-picker > span { display: grid; gap: 3px; }
.attachment-picker b { color: var(--text); font-size: 12px; }
.attachment-picker small { color: var(--muted); font-size: 10px; font-weight: 500; }
.attachment-picker input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
}
.attachment-picker:focus-within { outline: 2px solid var(--brand-strong); outline-offset: 2px; }

.attachment-list { display: grid; gap: 7px; }
.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 10px;
  background: var(--panel-2);
}
.attachment-item > span { min-width: 0; }
.attachment-item b,.attachment-item small { display: block; }
.attachment-item b { overflow: hidden; color: var(--text); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.attachment-item small { margin-top: 2px; color: var(--muted); font-size: 9px; }
.attachment-item button { flex: none; border: 0; padding: 5px 7px; background: transparent; color: var(--brand-strong); font-size: 10px; font-weight: 800; cursor: pointer; }
.attachment-demo-note { margin: -2px 0 0; color: var(--muted); font-size: 10px; line-height: 1.45; }
EOF

npm run build
npm run lint
git diff --check

git add src/pages/MissingPages.tsx src/pages/MissingPages.css
if ! git diff --cached --quiet; then
  git commit -m "feat: dodaj zalaczniki do pomyslow"
fi

echo "== Naprawa 02b =="

# 02b: import może jeszcze nie istnieć.
if ! grep -q "readability.css" src/App.tsx; then
  git apply --check 02b_zwieksz_czytelnosc_bez_App_css.patch
  git apply 02b_zwieksz_czytelnosc_bez_App_css.patch
fi

# Poprzedni patch 02b również omyłkowo nie zawierał samego arkusza.
cat > src/readability.css <<'EOF'
/* Czytelność interfejsu — większa mikrotypografia bez powiększania dużych nagłówków */
:root {
  --font-micro: 10px;
  --font-small: 11px;
  --font-ui: 12px;
  --font-body: 13px;
}

.brand span,.sidebar-caption,.support-mini span,.sidebar-social a,.profile-copy small,.mini-status,.hero-status,.summary-card small,.status-ring-content span,.status-legend li,.status-chip,.project-visual .category-badge,.activity-list small,.tag,.binding,.poll-letter,.poll-footer,.category-list a,.category-list span,.reminders-card li small,.reminders-login,.content-thumb > span,.content-body > span,.review-copy > span,.review-card article > span,.review-copy small,.score small,.reviews-section .review-copy > span,.comparison-card small,.topbar-search kbd,.paleta-wyszukiwania__pole kbd,.paleta-wyszukiwania__stopka kbd,.grupa-wynikow h2,.wynik-wyszukiwania__typ,.wynik-wyszukiwania__tresc small,.wynik-wyszukiwania__kategoria,.paleta-wyszukiwania__stopka,.karta-wyniku-wyszukiwania__typ,.karta-wyniku-wyszukiwania__metadane span,.tabela-porownania th,.lista-rekomendacji span,.karta-produktu-porownania__tresc small,.karta-produktu-porownania__metadane span,.karta-produktu-porownania__metadane strong,.attachment-picker small,.attachment-item small { font-size: var(--font-micro); }

.project-progress-label,.project-signal,.toolbar,.demo-note,.project-meta-row,.timeline-item,.about-values span,.privacy-note p,.review-card.locked-review::after,.reminders-card li,.poll-result-head,.project-filters button,.category-pills button,.collaboration-chips span,.metadane-porownania span,.lista-rekomendacji article,.karta-produktu-porownania__miniatura,.narzedzia-porownania label,.lista-publikacji button:not(.button),.button.compact,.attachment-item b { font-size: var(--font-small); }

.nav-item,.support-mini b,.sidebar-add,.theme-switch,.profile-copy b,.topbar-view span,.topbar-view button,.segmented button,.account-button,.button,.text-link,.hero-kicker,.summary-card span,.section-more a,.activity-list p,.feature-card > p,.collaboration-card p,.content-body p,.review-card p,.support-strip p,.comparison-card p,.info-card p,.support-card p,.feature-list,.timeline-item p,.detail-card > p,.simple-page-card p,.faq-list p,.komunikat-funkcji__popover,.wynik-wyszukiwania__tresc b,.paleta-wyszukiwania__podpowiedz,.paleta-wyszukiwania__wszystkie,.liczba-wynikow,.karta-wyniku-wyszukiwania p,.sekcja-rekomendacji > p,.karta-produktu-porownania__tresc p,.tabela-porownania,.narzedzia-porownania select,.narzedzia-porownania input,.guest-lock-overlay > span:last-child { font-size: var(--font-ui); }

.section-head p,.page-hero p,.hero-copy > p,.project-card p,.about-copy p,.project-detail-hero p,.topbar-search input,.contact-form input,.contact-form select,.contact-form textarea,.panel-publikacji input,.panel-publikacji select,.pelne-wyszukiwanie__pole input { font-size: var(--font-body); }

.contact-form label,.panel-publikacji label,.panel-publikacji .etykieta-pola { font-size: var(--font-ui); }
.panel-publikacji p,.panel-publikacji legend { font-size: var(--font-ui); }
.panel-publikacji__status b { font-size: 14px; }
.content-body h3,.review-card h3 { font-size: 15px; }
.faq-list summary { font-size: var(--font-body); }
.komunikat-funkcji__popover b,.guest-lock-overlay strong { font-size: var(--font-ui); }
.paleta-wyszukiwania__pole input { font-size: 14px; }
.karta-wyniku-wyszukiwania h2 { font-size: 16px; }
.sekcja-rekomendacji h2 { font-size: 16px; }
EOF

npm run build
npm run lint
git diff --check

git add src/App.tsx src/readability.css
if ! git diff --cached --quiet; then
  git commit -m "style: zwieksz czytelnosc interfejsu"
fi

echo
echo "== GOTOWE =="
git status --short
git log --oneline -7
echo
echo "Teraz uruchom: npm run dev"
echo "Po sprawdzeniu: git push origin main"
