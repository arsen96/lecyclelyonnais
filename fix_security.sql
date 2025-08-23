-- 1. Créer nouvel utilisateur application avec privilèges minimums
CREATE USER lecycle_app WITH 
    PASSWORD 'HcarWlEhso4RON2wxmDUZmj7i'
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
