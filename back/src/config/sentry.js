// config/sentry.js
// Configuration Sentry pour HomeCyclHome - Architecture Node.js/Express
require('dotenv').config();
const Sentry = require('@sentry/node');

// Fonction utilitaire pour catégoriser les endpoints
function getEndpointType(url) {
  if (url.includes('/auth/')) return 'authentication';
  if (url.includes('/technicians/')) return 'technician_management';
  if (url.includes('/interventions/')) return 'intervention_management';
  if (url.includes('/clients/')) return 'client_management';
  if (url.includes('/bicycles/')) return 'bicycle_management';
  if (url.includes('/companies/')) return 'company_management';
  if (url.includes('/zones/')) return 'zone_management';
  if (url.includes('/admin/')) return 'admin_operations';
  return 'other';
}

// Configuration principale Sentry - VERSION SIMPLIFIÉE
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,

  // Configuration des breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Filtrer les breadcrumbs sensibles
    if (breadcrumb.category === 'http' && breadcrumb.data) {
      // Masquer les données sensibles dans les URLs
      if (breadcrumb.data.url && breadcrumb.data.url.includes('password')) {
        breadcrumb.data.url = breadcrumb.data.url.replace(/password=[^&]+/gi, 'password=***');
      }
    }
    
    return breadcrumb;
  }
});

// Middleware personnalisé pour ajouter le contexte utilisateur - VERSION MODERNE
const sentryUserContextMiddleware = (req, res, next) => {
  Sentry.withScope((scope) => {
    // Informations sur le domaine/entreprise (marque blanche)
    const domain = req.headers.host || 'unknown';
    scope.setTag('domain', domain);
    scope.setTag('subdomain', domain.split('.')[0]);
    
    // Contexte utilisateur si authentifié
    if (req.user) {
      scope.setUser({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        company_id: req.user.company_id || null,
        username: req.user.username || req.user.email
      });
      
      scope.setTag('user_role', req.user.role);
      scope.setTag('user_company', req.user.company_id);
      
      // Contexte spécifique selon le rôle
      switch (req.user.role) {
        case 'superadmin':
          scope.setTag('access_level', 'super');
          break;
        case 'admin':
          scope.setTag('access_level', 'company');
          scope.setContext('company', { id: req.user.company_id });
          break;
        case 'technician':
          scope.setTag('access_level', 'technician');
          scope.setContext('technician', { 
            id: req.user.id,
            zone_id: req.user.zone_id 
          });
          break;
        case 'client':
          scope.setTag('access_level', 'client');
          scope.setContext('client', { id: req.user.id });
          break;
      }
    }
    
    // Contexte des paramètres de route
    if (req.params) {
      if (req.params.technicianId) {
        scope.setContext('technician', { id: req.params.technicianId });
      }
      if (req.params.interventionId) {
        scope.setContext('intervention', { id: req.params.interventionId });
      }
      if (req.params.clientId) {
        scope.setContext('client', { id: req.params.clientId });
      }
      if (req.params.companyId) {
        scope.setContext('company', { id: req.params.companyId });
      }
    }
    
    // Informations sur la requête
    scope.setContext('request_info', {
      method: req.method,
      url: req.originalUrl,
      user_agent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};



// Fonction pour tracker les métriques métier
const trackBusinessMetric = (metricName, value, tags = {}) => {
  Sentry.addBreadcrumb({
    message: `Business metric: ${metricName}`,
    category: 'business.metric',
    level: 'info',
    data: {
      metric: metricName,
      value,
      timestamp: new Date().toISOString(),
      ...tags
    }
  });
};

// Capturer les erreurs avec contexte
const captureBusinessError = (error, operation, context = {}) => {
  Sentry.captureException(error, {
    tags: {
      error_type: 'business_error',
      operation,
      ...context.tags
    },
    extra: {
      operation,
      business_context: context,
      timestamp: new Date().toISOString()
    },
    level: 'error'
  });
};



module.exports = {
  Sentry,
  sentryUserContextMiddleware,
  trackBusinessMetric,
  captureBusinessError,
};