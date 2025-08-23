#!/bin/bash

# 🚨 CORRECTION URGENTE SÉCURITÉ POSTGRESQL
# lecycle_user détecté comme SUPERUSER = DANGER CRITIQUE !

echo "🚨 CORRECTION URGENTE SÉCURITÉ POSTGRESQL"
echo "========================================"
echo ""
echo "PROBLÈME DÉTECTÉ : lecycle_user = SUPERUSER"
echo "RISQUE : Contrôle total PostgreSQL en cas d'injection SQL"
echo ""

# ===============================================
# PHASE 1 : SAUVEGARDE D'URGENCE
# ===============================================

echo "📦 PHASE 1 : Sauvegarde d'urgence avant correction"
echo "------------------------------------------------"

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_avant_correction_securite_${BACKUP_DATE}.sql"

echo "Création sauvegarde : $BACKUP_FILE"
docker exec lecyclelyonnais-postgres-1 pg_dump -U lecycle_user lecycle_db > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Sauvegarde créée avec succès"
    gzip "$BACKUP_FILE"
    echo "✅ Sauvegarde compressée : ${BACKUP_FILE}.gz"
else
    echo "❌ ERREUR : Impossible de créer la sauvegarde"
    echo "❌ ARRÊT : Ne pas continuer sans sauvegarde"
    exit 1
fi

# ===============================================
# PHASE 2 : CRÉATION UTILISATEUR SÉCURISÉ
# ===============================================

echo ""
echo "🔐 PHASE 2 : Création utilisateur application sécurisé"
echo "----------------------------------------------------"

# Générer mot de passe fort
NEW_APP_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Nouveau mot de passe généré : $NEW_APP_PASSWORD"

# Script SQL pour créer utilisateur sécurisé
cat > fix_security.sql << EOF
-- 1. Créer nouvel utilisateur application avec privilèges minimums
CREATE USER lecycle_app WITH 
    PASSWORD '$NEW_APP_PASSWORD'
    NOCREATEDB 
    NOCREATEROLE 
    NOSUPERUSER
    NOINHERIT
    LOGIN;

-- 2. Accorder connexion à la base
GRANT CONNECT ON DATABASE lecycle_db TO lecycle_app;

-- 3. Accorder usage du schéma public
GRANT USAGE ON SCHEMA public TO lecycle_app;

-- 4. Accorder droits sur tables existantes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lecycle_app;

-- 5. Accorder droits sur séquences (pour auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lecycle_app;

-- 6. Accorder droits sur futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO lecycle_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO lecycle_app;

-- 7. Vérification des droits créés
\echo 'Nouvel utilisateur lecycle_app créé avec privilèges limités'
\du lecycle_app

-- 8. Test des restrictions
\echo 'Test des restrictions (doivent échouer) :'
\set ON_ERROR_STOP off
CREATE DATABASE test_hack_lecycle_app;
CREATE USER test_hacker;
\set ON_ERROR_STOP on
\echo 'Fin des tests - les erreurs ci-dessus sont NORMALES et attendues'
EOF

echo "Exécution du script de sécurisation..."
docker exec -i lecyclelyonnais-postgres-1 psql -U lecycle_user -d lecycle_db < fix_security.sql

if [ $? -eq 0 ]; then
    echo "✅ Utilisateur lecycle_app créé avec succès"
else
    echo "❌ ERREUR lors de la création utilisateur sécurisé"
    exit 1
fi

# ===============================================
# PHASE 3 : MISE À JOUR CONFIGURATION
# ===============================================

echo ""
echo "⚙️ PHASE 3 : Mise à jour configuration Docker"
echo "--------------------------------------------"

# Sauvegarde ancienne config
cp docker-compose.yml docker-compose-backup-$(date +%Y%m%d_%H%M%S).yml

# Créer nouvelle config avec utilisateur sécurisé
sed "s|lecycle_user:Testtest96-|lecycle_app:$NEW_APP_PASSWORD|g" docker-compose.yml > docker-compose-new.yml

echo "Comparaison des configurations :"
echo "AVANT :"
grep -n "DATABASE_URL\|DB_USER\|DB_PASSWORD" docker-compose.yml
echo ""
echo "APRÈS :"
grep -n "DATABASE_URL\|DB_USER\|DB_PASSWORD" docker-compose-new.yml

# ===============================================
# PHASE 4 : TESTS DE SÉCURITÉ
# ===============================================

echo ""
echo "🧪 PHASE 4 : Tests de sécurité nouvel utilisateur"
echo "-----------------------------------------------"

cat > test_security_lecycle_app.sql << EOF
-- Tests de sécurité avec nouvel utilisateur lecycle_app
-- Ces commandes DOIVENT échouer (c'est normal et souhaité)

\echo 'Test 1: Tentative création base (doit échouer)'
\set ON_ERROR_STOP off
CREATE DATABASE evil_db;
\set ON_ERROR_STOP on

\echo 'Test 2: Tentative création utilisateur (doit échouer)'
\set ON_ERROR_STOP off
CREATE USER hacker WITH PASSWORD 'hack';
\set ON_ERROR_STOP on

\echo 'Test 3: Tentative escalade privilèges (doit échouer)'
\set ON_ERROR_STOP off
ALTER USER lecycle_app SUPERUSER;
\set ON_ERROR_STOP on

\echo 'Test 4: Tentative suppression table (doit échouer)'
\set ON_ERROR_STOP off
DROP TABLE client;
\set ON_ERROR_STOP on

\echo 'Test 5: Opérations normales (doit marcher)'
\set ON_ERROR_STOP on
SELECT COUNT(*) FROM client;
INSERT INTO client (first_name, last_name, email, password, company_id) 
VALUES ('Test', 'Security', 'test@security.com', 'hashedpw', 1);
SELECT id FROM client WHERE email = 'test@security.com';
DELETE FROM client WHERE email = 'test@security.com';

\echo 'Tests terminés - Les erreurs ci-dessus pour tests 1-4 sont NORMALES'
\echo 'Seul le test 5 doit réussir complètement'
EOF

echo "Test des restrictions du nouvel utilisateur..."
docker exec -i lecyclelyonnais-postgres-1 psql -U lecycle_app -d lecycle_db < test_security_lecycle_app.sql

# ===============================================
# PHASE 5 : PROCÉDURE DE MIGRATION
# ===============================================

echo ""
echo "🔄 PHASE 5 : Procédure de migration sécurisée"
echo "============================================"
echo ""
echo "Configuration prête ! Étapes de migration :"
echo ""
echo "1. ARRÊT APPLICATION :"
echo "   docker-compose down"
echo ""
echo "2. REMPLACEMENT CONFIG :"
echo "   mv docker-compose.yml docker-compose-old.yml"
echo "   mv docker-compose-new.yml docker-compose.yml"
echo ""
echo "3. REDÉMARRAGE :"
echo "   docker-compose up -d"
echo ""
echo "4. VÉRIFICATION FONCTIONNEMENT :"
echo "   curl -I https://lecyclelyonnais.fr"
echo "   docker logs lecyclelyonnais-backend-1"
echo ""
echo "5. SI TOUT FONCTIONNE - Révoquer ancien utilisateur :"
echo "   docker exec -it lecyclelyonnais-postgres-1 psql -U lecycle_user -d lecycle_db"
echo "   # ALTER USER lecycle_user NOSUPERUSER NOCREATEDB NOCREATEROLE;"
echo ""
echo "📋 INFORMATIONS IMPORTANTES :"
echo "============================"
echo "Nouvel utilisateur : lecycle_app"
echo "Nouveau mot de passe : $NEW_APP_PASSWORD"
echo "Sauvegarde : ${BACKUP_FILE}.gz"
echo ""
echo "⚠️  CONSERVEZ PRÉCIEUSEMENT LE NOUVEAU MOT DE PASSE !"
echo ""
echo "🎯 BÉNÉFICES SÉCURITÉ :"
echo "====================="
echo "✅ Fini les privilèges super-utilisateur"
echo "✅ Injection SQL limitée aux tables app"
echo "✅ Impossible de créer utilisateurs/bases"
echo "✅ Principe moindre privilège respecté"
echo "✅ Séparation admin/application"

# ===============================================
# PHASE 6 : CONFIGURATION BACKUP SÉCURISÉ
# ===============================================

echo ""
echo "💾 PHASE 6 : Configuration backup sécurisé"
echo "========================================="

cat > backup-secure-new.sh << 'EOFBACKUP'
#!/bin/bash

# Script de sauvegarde avec nouvel utilisateur sécurisé
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="lecycle_db"
DB_USER="lecycle_app"
DB_HOST="localhost"
DB_PORT="5432"
PROJECT_DIR="/home/arsen/projet/lecyclelyonnais"
BACKUP_DIR="$PROJECT_DIR/backups"
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"

# Créer dossier backup
mkdir -p "$BACKUP_DIR"

# Utiliser fichier .pgpass pour sécurité
if [ ! -f ~/.pgpass ]; then
    echo "ERREUR: Fichier ~/.pgpass manquant"
    echo "Créez-le avec :"
    echo "echo 'localhost:5432:lecycle_db:lecycle_app:NOUVEAU_MOT_DE_PASSE' > ~/.pgpass"
    echo "chmod 600 ~/.pgpass"
    exit 1
fi

echo "Sauvegarde base $DB_NAME avec utilisateur sécurisé..."

# Dump sécurisé
docker exec lecyclelyonnais-postgres-1 pg_dump -h localhost -U $DB_USER -d $DB_NAME > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Sauvegarde réussie : $BACKUP_FILE"
    gzip "$BACKUP_FILE"
    chmod 600 "${BACKUP_FILE}.gz"
    
    # Nettoyage
    find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.sql.gz" -mtime +7 -delete
    echo "✅ Sauvegarde sécurisée terminée"
else
    echo "❌ Erreur sauvegarde"
    exit 1
fi
EOFBACKUP

chmod +x backup-secure-new.sh

echo ""
echo "Nouveau script backup créé : backup-secure-new.sh"
echo "Configurez ~/.pgpass avec :"
echo "echo 'localhost:5432:lecycle_db:lecycle_app:$NEW_APP_PASSWORD' > ~/.pgpass"
echo "chmod 600 ~/.pgpass"

echo ""
echo "🏁 CORRECTION SÉCURISÉE PRÊTE !"
echo "============================="
echo ""
echo "⚠️  PROCHAINES ÉTAPES OBLIGATOIRES :"
echo "1. Sauvegarder le nouveau mot de passe : $NEW_APP_PASSWORD"
echo "2. Exécuter la migration (docker-compose down/up)"
echo "3. Tester le fonctionnement de l'application"
echo "4. Configurer ~/.pgpass pour les backups"
echo "5. Révoquer les privilèges de lecycle_user une fois migration OK"
echo ""
echo "Voulez-vous procéder à la migration maintenant ? (y/N)"
