const express = require('express');
const app = express();
const routes = require('./routes/index');
const routesAuth = require('./routes/authRoute');
require('dotenv').config()
const cors = require('cors'); 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:8100', 
  credentials: true 
}));

// Middleware for JSON requests
app.use(express.json());

// Import and use routes
app.use('/api', routes);
app.use('/auth', routesAuth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
