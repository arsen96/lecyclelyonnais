#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="lecycle_db"
DB_USER="lecycle_user"
DB_HOST="localhost"
DB_PORT="5433"
PROJECT_DIR="/root/projet/lecyclelyonnais"
BACKUP_FILE="$PROJECT_DIR/back/backups/backup_${DB_NAME}_${DATE}.sql"


# Dump de la base de données
PGPASSWORD="Testtest96-" pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    # Compression du fichier
    gzip $BACKUP_FILE
    find "$PROJECT_DIR/back/backups" -name "backup_${DB_NAME}_*.sql.gz" -mtime +7 -delete
else
    echo "Erreur lors de la sauvegarde."
    exit 1
fi


