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
