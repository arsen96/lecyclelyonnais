# Guide de déploiement HomeCycl'Home

## 🏗️ Infrastructure

**Production :**
- **Serveur** : VPS Contabo 
- **URL** : https://www.lecyclelyonnais.fr
- **SSL** : Let's Encrypt automatique
- **Stack** : Docker + Docker Compose + Nginx reverse proxy

## Environnements

### Développement
```bash
# Lancement local
docker-compose up -d
# Frontend: http://localhost:4200
# Backend: http://localhost:3000
# pgAdmin: http://localhost:5050
```

### Production
```bash
# Images pré-construites via CI/CD
# Redémarrage automatique
# Réseau isolé sécurisé
```

##  Pipeline CI/CD (.github/workflows/ci-cd.yaml)

**Déclenchement :** Push sur `main`, `develop`, `feature/*`

**Jobs automatisés :**
1. Tests API (Newman/Postman)
2. Tests unitaires (Mocha/Chai, Jasmine/Karma)
3. Tests E2E (Cypress)
4. Build images Docker → Docker Hub
5. Scan sécurité (Trivy)
6. Déploiement production (branche main uniquement)

##  Scripts principaux

### Sauvegarde automatique (backup.sh)
```bash
# Exécution : quotidienne à 2h00 + avant chaque déploiement
# Format : PostgreSQL dump compressé
# Rétention : 7 jours
./backup.sh  # Exécution manuelle
```

### Configuration Nginx
```nginx
# Reverse proxy avec SSL
# Frontend: / → http://localhost:8100
# Backend: /api/ → http://localhost:3000
# Redirection automatique HTTP → HTTPS
```

##  Procédures de déploiement

### Automatique (Recommandé)
```bash
git push origin main  # Déploiement automatique via GitHub Actions
```

### Manuel d'urgence
```bash
ssh root@lecyclelyonnais.fr
cd /opt/lecycle-production
./backup.sh                    # Sauvegarde
docker-compose down            # Arrêt
docker-compose pull            # Mise à jour
docker-compose up -d           # Redémarrage
docker system prune -f         # Nettoyage
```

### Rollback
```bash
# 1. Restaurer la sauvegarde
gunzip backup_*.sql.gz
psql -U user -d db < backup_*.sql

# 2. Redémarrer
docker-compose up -d
```

## 🔧 Tests automatisés

**Types de tests intégrés :**
- **API** : Collections Postman synchronisées
- **Unitaires Backend** : Mocha/Chai (contrôleurs)
- **Unitaires Frontend** : Jasmine/Karma (composants Angular)
- **End-to-End** : Cypress (parcours utilisateur complets)


##  Sécurité

- **Analyse automatique** : Trivy (vulnérabilités), SonarQube (qualité code)
- **Monitoring** : Sentry (erreurs)
- **Sauvegardes** : Automatiques quotidiennes + avant déploiement
- **SSL/HTTPS** : Certificats Let's Encrypt avec renouvellement automatique

## ⚙️ Variables d'environnement

```bash
# Fichier .env (production)
NODE_ENV=
JWT_SECRET=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_NAME=
```

## Support

**Logs utiles :**
```bash
docker-compose logs backend frontend  # Logs application
sudo tail -f /var/log/nginx/error.log  # Logs Nginx
```
