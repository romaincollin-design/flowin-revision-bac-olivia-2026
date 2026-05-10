SCHEMA_SUPABASE.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tables Supabase :
- joueurs (id, ts, updated_at, pseudo UNIQUE, prenom, nom, 
  email, ecole, classe, genre, pts_total, streak, ligue, 
  pwa_installed, pwa_installed_at, ref)
- sessions (id, ts, pseudo, ecole, theme, matiere, score_pct, 
  pts_round, pts_total, streak, nb_questions, nb_bonnes)
- defis (id text PK, ts, nom, createur, theme, mise, cap, 
  is_private, status, participants jsonb, invite, 
  score_createur, score_invite, gagnant, countdown_start,
  last_ping_createur, last_ping_invite)
- defis_participants (id, defi_id, pseudo, mise, ts)
- connexions (id, ts, pseudo, device, duree_min)
- parrainage (id, ts, sender, sender_email, sender_etab, 
  destinataire, channel, pts)
- config (key PK, value jsonb, updated_at)
  clés : bareme, ligues_seuils, form_config, lots, lots_active
- lots_stock (id, lot_id, code, attribue bool, 
  attribue_a, attribue_at)
- gains (id, ts, pseudo, lot_id, lot_titre, code, condition)
- analytics_events (id, ts, event, pseudo, ecole, 
  properties jsonb, session_id, user_agent, referrer)
- analytics_kpi_snapshots (id, date UNIQUE, nb_joueurs, 
  nb_sessions, score_moy, dau, wau, mau, nb_parr, 
  retention_7j, top_theme, top_matiere, created_at)