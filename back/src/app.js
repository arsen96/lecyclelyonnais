const express = require('express');
const path = require('path');
const app = express();
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
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:8100', 'http://localhost:8200', 'http://localhost:8300', 'http://company.localhost:8100'], 
//   credentials: true 
// }));
// Middleware for JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques du dossier 'uploads'
console.log("__dirname",__dirname)
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
