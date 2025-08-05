// scripts/sync-postman.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Configuration
const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const COLLECTION_ID =  '76ac86fa-889f-44c1-b0ed-db72bb5589fb';
const ENVIRONMENT_ID = 'e12379c1-26d6-409c-855a-1d789e31f42e';

const OUTPUT_DIR = './tests/postman';

async function syncPostmanAssets() {
    try {
       
        const headers = {
            'X-API-Key': POSTMAN_API_KEY,
            'Content-Type': 'application/json'
        };

        if (COLLECTION_ID) {
            console.log('Récupération de la collection...');
            const collectionResponse = await axios.get(
                `https://api.getpostman.com/collections/${COLLECTION_ID}`,
                { headers }
            );
            
            const collectionPath = path.join(OUTPUT_DIR, 'collections', 'lecyclelyonnais.postman_collection.json');
            console.log("collectionResponse.data.collection", collectionResponse.data.collection);
            // Créer le dossier s'il n'existe pas
            fs.mkdirSync(path.dirname(collectionPath), { recursive: true });
            
            fs.writeFileSync(collectionPath, JSON.stringify(collectionResponse.data.collection));
        }

        if (ENVIRONMENT_ID) {
            const environmentResponse = await axios.get(
                `https://api.getpostman.com/environments/${ENVIRONMENT_ID}`,
                { headers }
            );
            
            const environmentPath = path.join(OUTPUT_DIR, 'environments', 'test.postman_environment.json');
            
            fs.mkdirSync(path.dirname(environmentPath), { recursive: true });
            
            fs.writeFileSync(environmentPath, JSON.stringify(environmentResponse.data.environment));
        }

        console.log('Sync terminée, prêt à lancer les tests');
        
    } catch (error) {
        console.error('Erreur lors de la synchronisation');
        process.exit(1);
    }
}



syncPostmanAssets();