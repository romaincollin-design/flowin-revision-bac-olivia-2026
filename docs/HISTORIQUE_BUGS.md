HISTORIQUE BUGS — NE JAMAIS RÉINTRODUIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDEX.HTML :
- BUG-VIEWS-01 : plusieurs vues actives → une seule : v-welcome
- BUG-MENU-01 : boutons menu profil non cliquables
  → menu 100% JS, jamais HTML statique
- BUG-USERMENU-01 : div invisible intercepte les clics
  → supprimer tout wrapper HTML statique de menu
- BUG-POINTS-01 : admin PATCH pts ignoré côté élève
  → MAX(sessions.pts_total, joueurs.pts_total)
- BUG-DEFI-01 : rooms publiques sans bots
  → dfSimulateBotJoins() après 1.5s
- BUG-DEFI-02 : URL ?room= persistante après défi
  → history.replaceState() en fin de défi
- BUG-QUIZ-DEFI-01 : réponses blanches sur fond blanc
  → structure A/B/C/D uniforme avec quiz solo
- BUG-POINTS-02 : trois compteurs divergents
  QS.totalScore / flowin_balance / joueurs.pts_total
- BUG-INSCRIPTION-01 : switchMode('inscription') ne vidait pas
  les champs → Olivia apparaissait pour nouvel utilisateur
- BUG-QUOTES-01 : quotes mal échappées dans onclick
  → roomId transmis vide, boutons inertes
- BUG-PENDING-01 : pending_room stale sans TTL
  → alert room introuvable intempestif au rechargement
- BUG-ALERT-01 : alert() bloquant qui freezait l'UI
  → remplacer par toasts non-bloquants 3 secondes
- BUG-GAINS-01 : ORDER BY created_at → corriger en ORDER BY ts

FLOWIN_ADMIN.HTML :
- BUG-ADMIN-BARÈME-01 : sliders et seuils ligues rendus 
  dynamiquement → getElementById échoue silencieusement
  → toujours HTML statique pour ces éléments
- BUG-ADMIN-LOTS-01 : renderStockPanel() et renderGainsPanel()
  doivent être appelés séparément, jamais ensemble dans 
  une seule passe dynamique
- BUG-ADMIN-SQL-01 : ADD CONSTRAINT IF NOT EXISTS 
  non supporté PostgreSQL → utiliser DO $$ BEGIN...END $$
- BUG-ADMIN-SQL-02 : doublons pseudo bloquent UNIQUE
  → DELETE doublons avant d'ajouter la contrainte
- BUG-ADMIN-POINTS-01 : adminUpdatePoints() PATCH Supabase
  mais ne met pas à jour DB.joueurs en mémoire
  → recharger loadData() ou mettre à jour localement