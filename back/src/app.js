require('./config/sentry');
const express = require('express');
const path = require('path');
const app = express();
app.set('trust proxy', 1);
const { sentryUserContextMiddleware } = require('./config/sentry'); 
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
const swaggerJsdoc = require('swagger-jsdoc');
const basicAuth = require('express-basic-auth');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config()
const cors = require('cors'); 
const { authLimiter, generalLimiter, helmetConfig } = require('./middlewares/security');
app.use(helmetConfig);
app.use(cors());
// Middleware for JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== MIDDLEWARE SENTRY CONTEXTE UTILISATEUR =====
app.use(sentryUserContextMiddleware);

// Servir les fichiers statiques du dossier 'uploads'
console.log("__dirname", __dirname)
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(generalLimiter);


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HomeCycl\'Home API',
      version: '1.0.0',
      description: 'API de gestion des interventions vélo multi-tenant',
    },
    servers: [
      {
        url: 'https://www.lecyclelyonnais.fr',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', basicAuth({
  users: { 'admin': process.env.DOCS_PASSWORD },
  challenge: true,
}), swaggerUi.serve, swaggerUi.setup(specs));

app.get('/api/', (req, res) => {
  res.json({ 
    message: 'HomeCycl\'Home API is running',
    version: '1.0.0',
    endpoints: {
      documentation: '/api-docs',
      auth: '/auth/*',
      zones: '/zones/*',
      technicians: '/technicians/*'
    }
  });
});


// app.use('/api', routes);
app.use('/api/auth',authLimiter, routesAuth);
app.use('/api/zones', routesZone);
app.use('/api/technicians', routesTechnician);
app.use('/api/bicycles', routesBicycle);
app.use('/api/interventions', routesIntervention);
app.use('/api/planning-models', routesPlanning);
app.use('/api/clients', routesClient);
app.use('/api/admins', routesAdmin);
app.use('/api/companies', routesCompany);

app.use((error, req, res, next) => {
  // Les erreurs sont déjà capturées par captureBusinessError
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
  console.log(`Server is running on port ${PORT}`);
});