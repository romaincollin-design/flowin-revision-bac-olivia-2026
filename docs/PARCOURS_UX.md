PARCOURS_UX.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDEX.HTML :
🟠 PWA
EE. manifest.json via Blob URL → créer fichier statique 
    manifest.json dans le repo
FF. Créer sw.js service worker minimal dans le repo
GG. Bouton installer → prompt natif Android non déclenché

🟠 UX MANQUANTE
HH. Pas de loader/spinner pendant appels Supabase
II. Pas de gestion erreur réseau si Supabase down
JJ. Bouton Telegram manquant dans le partage
KK. nb_questions_quiz dans BAREME_CONFIG jamais utilisé
    → brancher sur le nombre de questions du quiz
LL. renderLotSemaine() doit gérer LOTS_ON=false sans erreur

FLOWIN_ADMIN.HTML :
🟠 UX ADMIN MANQUANTE
KKK. Pas de confirmation avant suppression ou modification 
     critique (ex: reset points élève)
LLL. Pas de feedback visuel après saveBaremeComplet()
     → toast "Barème sauvegardé ✓"
MMM. Pas de feedback après attribuerLot()
     → toast "Code attribué à [pseudo] ✓"
NNN. Bouton Sync (↻) ne montre pas de loader pendant loadData()
OOO. Pas de gestion erreur si Supabase timeout dans loadData()