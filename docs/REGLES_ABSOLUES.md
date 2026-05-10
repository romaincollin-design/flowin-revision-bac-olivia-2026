RÈGLES ABSOLUES — NE JAMAIS VIOLER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
R1.  Clé Supabase = toujours iat:1777224405, jamais sb_publishable
R2.  Jamais template literals imbriqués dans innerHTML
     → concaténation de strings uniquement
R3.  node --check après chaque modification — 0 erreur obligatoire
R4.  Catch de loadData() = tableaux vides uniquement
     DB.joueurs=[], DB.sessions=[], DB.parrainage=[],
     DB.connexions=[], LOTS_DB=[], STOCK_DB=[], GAINS_DB=[]
R5.  Jamais de données démo dans DB.joueurs/sessions/parrainage
R6.  SB_ENABLED = true dans index.html
R7.  flowin_admin.html utilise SB_KEY et SB_URL
     JAMAIS SUPABASE_KEY ni SUPABASE_URL
R8.  Cagnotte = mise × 2 — toujours, partout, sans exception
R9.  Une seule vue avec class="view active" : v-welcome
R10. Menus flottants = 100% JS createElement — jamais HTML statique
R11. Jamais patcher sur un patch — repartir du fichier validé
R12. Montrer le diff et attendre validation avant chaque correction
R13. Livrer index.html + flowin_admin.html + SQL simultanément
R14. getTotalPts = MAX(sessions.pts_total, joueurs.pts_total)
     jamais l'un sans l'autre
R15. Barème et seuils ligues = HTML statique dans flowin_admin.html
     jamais rendu dynamiquement (display:none bloque getElementById)