# HomeCycl’Home

HomeCycl’Home est une application d'entretien et de réparation de vélos à domicile. Elle propose des fonctionnalités de gestion des rendez-vous, de personnalisation en marque blanche pour d'autres entreprises, et d'optimisation des interventions techniques.

## Fonctionnalités principales

- **Prise de rendez-vous personnalisée :**
  - Les clients peuvent sélectionner une adresse ou utiliser une adresse préenregistrée.
  - Choix du type d'opération (ég. maintenance ou réparation).
  - Ajout de détails (photos, articles, marque du cycle).

- **Gestion des zones géographiques :**
  - Attribution automatique des rendez-vous en fonction des zones d'intervention des techniciens.
  - Modèles de planification.

- **Gestion des utilisateurs :**
  - Rôles définis : super administrateur, administrateur, techniciens, clients.

- **Suivi et documentation des interventions :**
  - Les techniciens peuvent ajouter des photos avant et après intervention.
  - Modification des dossiers en temps réel.
  - Validation

- **Personnalisation en marque blanche :**
  - Sous-domaines personnalisés pour chaque entreprise.
  - Couleurs adaptés à la marque.

## Technologies utilisées

### Backend
- **Node.js** : Gestion de l'application backend.
- **PostgreSQL** : Base de données relationnelle pour la gestion des utilisateurs et des rendez-vous.
- **Docker** : Conteneurisation des services backend et base de données.

### Frontend
- **Ionic/Angular** : Application mobile et interface utilisateur dynamique.

### Autres outils
- **Nginx** : Serveur pour le frontend.
- **Docker Compose** : Orchestration des services (backend, frontend, base de données).

## Installation

### Prérequis
- **Node.js** : Version 16+.
- **PostgreSQL** : Version 13+.
- **Docker et Docker Compose** : Version récente.

### Démarrage local

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/arsen96/lecyclelyonnais.git
   cd lecyclelyonnais
   ```

2. Lancez les services avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

3. Accédez à l'application :
   - Frontend : [http://localhost:4200](http://localhost:4200)
   - Backend API : [http://localhost:3000](http://localhost:3000)

### Configuration

## API
- Copiez le fichier .env.exemple à la racine du projet, renommez-le en .env, puis configurez les variables d'environnement suivantes avec vos propres valeurs :
    - PORT
    - JWT_SECRET
    - JWT_EXPIRES_IN
    - DB_USER
    - DB_PASSWORD
    - DB_PORT
    - DB_HOST
    - DB_HOST_LOCAL
    - DB_NAME
      
 ## Front
  ### Angular
  - Modifier le fichier .environment avec vos propres valeurs :
    - GOOGLE_MAP_API
  

## Contribution

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE] pour plus de détails.

## Auteur

- **KUBATYAN Arsen** - Fondateur et développeur principal

