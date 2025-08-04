require('./config/sentry');
const express = require('express');
const path = require('path');
const app = express();
const { sentryUserContextMiddleware } = require('./config/sentry'); // Enlever Sentry d'ici
const routes = require('./routes/index');
const routesAuth = require('./routes/authRoute');
const routesZone = require('./routes/zoneRoute');
const routesTechnician = require('./routes/technicianRoute');
const routesBicycle = require('./routes/bicycleRoute');
const routesIntervention = require('./routes/interventionRoute');
const routesPlanning = require('./routes/planningModelRoute');
const routesClient = require('./routes/clientRoute');
const routesAdmin = require('./routes/adminRoute');
const routesCompany = require('./routes/companyRoute');
require('dotenv').config()
const cors = require('cors'); 


app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:8100', 'http://localhost:8200', 'http://localhost:8300', 'http://company.localhost:8100'], 
//   credentials: true 
// }));

// Middleware for JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== MIDDLEWARE SENTRY CONTEXTE UTILISATEUR =====
app.use(sentryUserContextMiddleware);

// Servir les fichiers statiques du dossier 'uploads'
console.log("__dirname", __dirname)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import and use routes
app.use('/api', routes);
app.use('/auth', routesAuth);
app.use('/zones', routesZone);
app.use('/technicians', routesTechnician);
app.use('/bicycles', routesBicycle);
app.use('/interventions', routesIntervention);
app.use('/planning-models', routesPlanning);
app.use('/clients', routesClient);
app.use('/admins', routesAdmin);
app.use('/companies', routesCompany);

app.use((error, req, res, next) => {
  // Les erreurs sont déjà capturées par captureBusinessError dans vos contrôleurs
  console.error('Erreur capturée:', error.message);
  
  if (error.status === 404) {
    return res.status(404).json({ error: 'Route non trouvée' });
  }
  
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

app.get('/test-sentry', (req, res) => {
  // Test d'erreur
  const { captureBusinessError, trackBusinessMetric } = require('./config/sentry');
  
  try {
    // Simuler une erreur
    throw new Error('Test erreur Sentry - HomeCyclHome');
  } catch (error) {
    captureBusinessError(error, 'test.sentry.error');
  }
  
  // Test métrique
  trackBusinessMetric('test.sentry.metric', 1, {
    test_type: 'manual',
    timestamp: new Date().toISOString()
  });
  
  res.json({ message: 'Test Sentry envoyé !' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});