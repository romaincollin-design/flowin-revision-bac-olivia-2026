TODO.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDEX.HTML :
🔴 FORMULAIRE D'INSCRIPTION
A. Champs non vidés → données Olivia visibles pour nouvel utilisateur
B. Picker établissement : ouverture, scroll, confirmation valeur
C. Picker date de naissance : 3 colonnes jour/mois/année
D. Picker classe : vérifier fonctionnement complet
E. Genre non remis à zéro à l'ouverture du formulaire
F. Validation visuelle manquante des champs obligatoires
G. Message de confirmation absent après inscription réussie
H. Champs cp et ddn collectés mais colonne absente dans joueurs
   → Ajouter via SQL : ALTER TABLE joueurs ADD COLUMN cp TEXT;
                       ALTER TABLE joueurs ADD COLUMN ddn TEXT;
   ET sauvegarder dans saveProfileToSheets()
I. Pas de feedback si email déjà utilisé

🔴 DÉFIS MULTI-JOUEURS
J. alert() bloquant "Room introuvable" → toast non-bloquant 3s
K. Rooms zombies status=waiting jamais nettoyées en Supabase
L. Boutons banner invitation : quotes mal échappées → roomId vide
M. pending_room stale sans TTL → alert intempestif
N. Billet créateur : QR code, WhatsApp, SMS, Copier fonctionnels ?
O. Billet invité : UI complète et bouton Rejoindre opérationnel ?
P. Toast "X a rejoint" absent côté créateur en salle d'attente
Q. Débit mise non reflété immédiatement en Supabase
R. Crédit victoire non sauvegardé en Supabase
S. Bots ne rejoignent pas systématiquement après 1.5s
T. URL ?room= non nettoyée après fin de défi

🔴 SYSTÈME DE POINTS
U. Créer une fonction centrale unique addPts()
V. Parrainage : +pts mémoire seulement → utiliser addPts()
W. Quiz POST joueurs sans on_conflict → doublons
   → PATCH joueurs?pseudo=eq.xxx uniquement
X. endRound() ne met pas à jour flowin_balance
Y. dfSetBalance ne synchro pas QS.totalScore

🔴 PROFIL UTILISATEUR
Z. Onglets Créés/En cours/Terminés non fonctionnels
AA. Cohérence clé localStorage : vérifier flowin_my_defis
    partout dans le code (pas de variante)
BB. Gains : ORDER BY created_at → ORDER BY ts
CC. QR code parrainage : vérifier affichage
DD. Bouton Déconnexion : vide userProfile + localStorage ?

FLOWIN_ADMIN.HTML :
🔴 DONNÉES ET CHARGEMENT
MM. loadData() : vérifier que le catch retourne bien
    tous les tableaux vides (R4) sans données démo
NN. getTotalPts : vérifier MAX(fromSessions, fromJoueurs)
    présent et fonctionnel partout
OO. buildElevs() : vérifier que isFakeAccount() filtre 
    correctement les comptes test/démo
PP. Promise.all([loadLotsFromSupabase(), loadStockAndGains()])
    vérifier que les deux sont bien appelés au démarrage
QQ. DB.joueurs non mis à jour après adminUpdatePoints()
    → mettre à jour en mémoire immédiatement après PATCH
    pour cohérence sans rechargement complet

🔴 BARÈME ET LIGUES
RR. Sliders barème : vérifier que saveBaremeComplet() 
    sauvegarde bien TOUS les champs dans config.bareme
SS. Seuils ligues : vérifier que saveLigues() sauvegarde
    dans config.ligues_seuils et que index.html les charge
TT. nb_questions_quiz sauvegardé dans barème admin
    mais jamais lu par index.html → brancher la connexion

🔴 LOTS ET STOCK
UU. renderStockPanel() : vérifier affichage codes par lot
VV. renderGainsPanel() : vérifier affichage gains par élève
WW. attribuerLot() : vérifier qu'il fait bien
    → PATCH lots_stock (attribue=true, attribue_a, attribue_at)
    → INSERT gains (pseudo, lot_id, lot_titre, code, condition)
    → Les deux ensemble, pas l'un sans l'autre
XX. Modal "Attribuer un code" : recherche élève fonctionnelle ?
YY. Compteur stock par lot : affiché et mis à jour en temps réel ?

🔴 VUE ÉLÈVES
ZZ. Fiche élève : onglets Créés/Participés/Terminés
    → renderDefisFiche() fonctionnelle pour les 3 onglets ?
AAA. adminUpdatePoints() : les 3 boutons + / - / = 
     déclenchent bien le prompt et le PATCH Supabase ?
BBB. Section Gains dans fiche élève : affiche les gains
     de GAINS_DB.filter(g => g.pseudo === pseudo) ?
CCC. Filtre recherche élèves : fonctionne en temps réel ?

🔴 VUES MANQUANTES OU INCOMPLÈTES
DDD. renderDefis() : affiche les rooms avec filtres 
     joueur/thème/période fonctionnels ?
EEE. renderParrainage() : filtres canal/établissement 
     fonctionnels ? Filleul lié au parrain affiché ?
FFF. renderLigues() : classement complet avec filtres 
     ligue/établissement/tri fonctionnels ?
GGG. renderEtabs() : stats par établissement correctes ?
HHH. renderStats() : graphiques et KPIs chargés 
     depuis analytics_kpi_snapshots ?
III. renderAppCom() : section communication opérationnelle ?
JJJ. renderTextes() : chargement et sauvegarde 
     via loadTextesFromSupabase() fonctionnels ?

🟠 SÉCURITÉ ET PERFORMANCE
PPP. Mot de passe admin en dur dans le code 
     → vérifier que ce n'est pas dans un endroit visible
QQQ. Pas de pagination sur les listes élèves/sessions 
     → limite 500 joueurs / 1000 sessions peut être dépassée
RRR. Token GitHub expire juin 2026 → générer nouveau token
     et mettre à jour dans les deux repos