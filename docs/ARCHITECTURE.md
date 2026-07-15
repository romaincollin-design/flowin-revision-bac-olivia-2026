ARCHITECTURE.md — SÉPARATION FLOWIN & MOTEUR COMMUN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rédigé le 15/07/2026. Document de référence. Toute décision structurelle
passe par ce fichier. Les sections marquées [À AUDITER] ne sont PAS
définitives : elles seront complétées après lecture du code réel (voir §10).


§0. LE CONSTAT (pourquoi ce document)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Flowin Révision et Flowin Events tournent aujourd'hui sur LE MÊME projet
  Supabase : ywcqtupgoxfzkddqkztk.
- Conséquence : la table `joueurs` est PARTAGÉE. Les inscriptions/parrainages
  Events (emails en 'j-nd-%', Nuits du Sud) sont mélangés aux vrais élèves.
- Le dashboard Révision lit `joueurs` sans filtre (flowin_admin.html ligne 2947 :
  val:DB.joueurs.length) → il affiche ~500 au lieu du vrai nombre d'élèves.
- CE N'EST PAS une contrainte Supabase. Supabase isole chaque projet. C'est un
  BRANCHEMENT des deux apps sur un même projet. Un branchement se défait.

Vérifié dans le code :
- eleve/index.html      → ywcqtupgoxfzkddqkztk.supabase.co
- admin/flowin_admin.html→ ywcqtupgoxfzkddqkztk.supabase.co
- handoff-nds-2026-comm (404k) stocké dans CE MÊME projet Supabase.
- Aucune référence 'nds'/'nuits du sud'/'j-nd' dans le code Flowin Révision
  (les 35 'nds' du grep = faux positifs : rounds, friends, grands...).


§1. LA CIBLE : DEUX BASES, UN MOTEUR, DEUX HABILLAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Principe : séparation PHYSIQUE des données, MUTUALISATION du code.

  ┌─────────────────────┐        ┌─────────────────────┐
  │  Supabase RÉVISION  │        │  Supabase EVENTS    │
  │  (projet actuel,    │        │  (NOUVEAU projet)   │
  │   nettoyé)          │        │                     │
  │  écoles/profs/      │        │  stations/annonceurs│
  │  classes/élèves/    │        │  joueurs événement/ │
  │  sessions scolaires │        │  lots/QR/tirages    │
  └──────────┬──────────┘        └──────────┬──────────┘
             │                              │
             └───────────┐      ┌───────────┘
                     ┌───┴──────┴───┐
                     │  FLOWIN-CORE │  ← moteur écrit UNE fois
                     │  (lib/ commun)│
                     │  CRM · dashboard · fiches · partenaires
                     │  points · auth · tracking · lots · ligues
                     └───┬──────┬───┘
             ┌───────────┘      └───────────┐
   ┌─────────┴─────────┐        ┌───────────┴───────┐
   │ config RÉVISION   │        │ config EVENTS     │
   │ (vocabulaire école)│       │ (vocabulaire event)│
   └───────────────────┘        └───────────────────┘

Un client qui achète Révision ne voit JAMAIS une ligne d'Events, et inversement.
C'est ce qui rend chaque produit vendable/licenciable seul (objectif initial).


§2. MAPPING DES ENTITÉS (même moteur, deux vocabulaires)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Le moteur ne connaît que des entités génériques. La config métier les nomme.

  MOTEUR (générique)   │ RÉVISION dit…        │ EVENTS dit…
  ─────────────────────┼──────────────────────┼─────────────────────
  groupe               │ école / classe       │ station / événement
  animateur            │ professeur           │ annonceur / partenaire
  participant          │ élève                │ joueur
  contenu              │ cours / quiz / défi  │ QR / défi / tirage
  dotation             │ récompense élève     │ lot commerçant
  détenteur de points  │ prof (challenges)    │ annonceur (dotation)
  cycle de ligue       │ jour/sem/mois/année  │ jour/sem/mois/année

Règle d'or (Étape 4 du prompt structurel) : créer une nouvelle école OU une
nouvelle station ne doit demander AUCUNE ligne de code. Les stats suivent.


§3. LE MOTEUR COMMUN (flowin-core) — CE QUI EST MUTUALISÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identique dans les deux produits, donc écrit une seule fois :
- CRM + liste + fiche utilisateur (slide-in)
- Dashboard : KPI, entonnoirs, stats, exports
- Partenaires / sponsors / pros
- Attribution & wallet de points (addPts centralisé)
- Distribution des lots + stock + QR
- Auth (hash SHA-256 + salt, login par email)
- Tracking (source unique lib/tracking)
- Ligues (clôture + rétribution par cycle)
- Anti-triche                                      [À AUDITER — vient d'Events]
- Règles de stockage                               [À AUDITER — vient d'Events]
- Templates / ergonomie UI station-QR              [À AUDITER — vient d'Events]

Ce qui DIFFÈRE (reste propre à chaque produit, dans app/ + config) :
- Le contenu pédagogique (matières/thèmes/questions) = RÉVISION only
- La cartographie stations/QR terrain = EVENTS only
- Le vocabulaire d'interface (voir §2)


§4. SCÉNARIO UNIFIÉ : L'ÉLÈVE DEVIENT UNE STATION DE JEU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Insight validé : le défi physique en cour d'école = une station de jeu Events
appliquée au scolaire. Même brique, contexte différent.

Flux cible :
1. Élève A ouvre son profil → génère un QR "défi".
2. Élève(s) B, C flashent le QR (ou lien WhatsApp/URL).
3. Le défi commun se lance : questions DIFFÉRENTES par joueur, MÊME timer.
4. À la fin du timer : transaction de points entre participants.
5. Rétribution des lots identique à Révision (voir §5).

→ La mécanique QR + timer + questions différenciées est une brique EVENTS.
   On l'importe, on ne la réécrit pas.                       [À AUDITER §10]


§5. LIGUES & LOTS (cycle journalier → annuel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- La ligue détermine les gagnants selon un cycle : jour / semaine / mois / année.
- Les gagnants d'un cycle décrochent les lots réservés à leur ligue.
- Mécanique IDENTIQUE Révision et Events → moteur commun.
- Révision a déjà : cloturer_ligue_mensuelle, attribuer_lot_auto.
  → à généraliser en cycle paramétrable (jour/sem/mois/année).


§6. LE PROFESSEUR DÉTENTEUR DE POINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Évolution validée : le prof reçoit un capital de points à distribuer à ses
élèves lors de challenges (hebdo/mensuel/semestriel/annuel).
- Même brique que "l'annonceur qui dote des lots" côté Events.
- Nécessite : rôle prof, wallet prof, action "attribuer N points à élève X".
- Révision a déjà adminUpdatePoints (côté admin) → à exposer côté prof, borné
  au wallet du prof et à sa classe.


NOTE 15/07 : séparation en DEUX projets Supabase = REPORTÉE, NON BLOQUANTE.
Les lignes sont déjà distinguables par source+client_type (voir D4). Aucun mélange
de données au sens strict. La migration physique reste souhaitable pour la vente
(un projet par produit) mais se fera plus tard, proprement.

§7. PLAN DE MIGRATION (quand le SQL sera revenu — BACKUP D'ABORD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ordre strict, aucune étape sautée :
1. BACKUP COMPLET des deux périmètres (export SQL + Google Sheet).
2. Créer le nouveau projet Supabase "flowin-events".
3. Copier vers Events : lignes 'j-nd-%' + tables spécifiques Events.
4. VÉRIFIER la copie (comptages identiques source/cible).
5. Supprimer de la base Révision : les lignes 'j-nd-%' et tables Events.
6. Vérifier : la base Révision ne contient plus que les vrais élèves.
   → Les 21 comptes du pilote ne sont PAS touchés, juste dé-noyés.
   → Le compteur "500" devient automatiquement le vrai nombre, sans filtre.
7. Rebrancher chaque app sur SON projet (clé + URL).

Filet AVANT migration (déblocage immédiat du dashboard, réversible) :
- Filtrer DB.joueurs au chargement : pseudo IS NOT NULL AND email NOT LIKE 'j-nd-%'.
- Ne masque pas le problème de fond, rend juste le dashboard honnête en attendant.
- Décision produit prise le 15/07 : "vrai élève = pseudo + email pas en j-nd-".


§8. RPC GÉNÉRIQUES CIBLES (Étape 4 du prompt structurel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
À créer, paramétrés par l'entité (école OU station), jamais de filtre en dur :
  flowin_daily(p_id, p_date)        — KPI du jour
  flowin_funnel(p_id, p_date)       — entonnoir + incidents
  flowin_engagement(p_id, p_date)   — rejeu, complétion
  flowin_demographie(p_id, p_date)  — âge, sexe, origine
Aujourd'hui : Révision n'appelle presque aucun RPC (REST direct). Events a des
RPC super_event_* dans la base partagée → base de départ à généraliser [§10].


§9. ARBORESCENCE CIBLE (Étape 3 du prompt structurel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  docs/    BOOTSTRAP · METHODE-mode-preview · ARCHITECTURE (ce fichier)
           RUNBOOK · backup/ · sql/ (une migration par fichier daté)
  app/     code applicatif propre au produit
  lib/     flowin-core — UNE source de vérité par sujet
  public/  cockpit + pages statiques + assets
Règle source unique : un sujet = un seul fichier. Traçage dans lib/tracking,
jamais dupliqué.


§10. CE QUI RESTE À AUDITER (ne rien inventer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ces briques doivent être LUES dans le code réel avant d'être portées :

  Brique               │ Où elle vit              │ Débloquée par
  ─────────────────────┼──────────────────────────┼────────────────────
  Anti-triche          │ Supabase partagée (RPC/  │ SQL live (actuellement
  Règles de stockage   │ triggers/contraintes) +  │ coupé) + repo Events
  RPC ligue/stats      │ super_event_*            │ SQL live
  Templates / ergonomie│ repo frontend Events     │ accès repo Events
  UI station-QR + timer│ repo frontend Events     │ accès repo Events

État des accès au 15/07 :
- Supabase : projet partagé accessible, MAIS outil SQL tombé en session.
- GitHub : token OK sur les 4 repos romaincollin-design. Events = autre compte,
  pas encore accessible.
- Vercel / Notion : connecteurs non actifs dans la session.


§11. DÉCISIONS PRISES (ne pas rouvrir)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- D1. Deux projets Supabase séparés (PAS une colonne 'projet' dans une base unique).
- D2. Un moteur commun flowin-core, écrit une fois, importé par les deux apps.
- D3. Ne pas réécrire ce qui fonctionne dans Events : on importe les briques.
- D4. Vrai élève Flowin = source NULL ET client_type NULL (discriminant CONÇU).
       Les joueurs Events sont toujours tagués source(nds2026/brigade-manuel/spin)
       et/ou client_type(btoc/btob). CORRIGE le critère 'j-nd-' (faux: 0 j-nd dans joueurs).
- D5. L'élève peut devenir une station de jeu (défi QR cour d'école).
- D6. Le prof devient détenteur de points distribuables lors de challenges.
