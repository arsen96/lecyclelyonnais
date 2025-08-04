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
  // environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  // release: process.env.SENTRY_RELEASE || 'homecyclhome@1.0.0',
  sendDefaultPii: true,
  // Échantillonnage des performances
  // tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // // Tags initiaux pour le projet
  // initialScope: {
  //   tags: {
  //     component: 'homecyclhome-api',
  //     version: process.env.npm_package_version || '1.0.0',
  //     architecture: 'node-express-multicouche'
  //   }
  // },

  // Configuration avant envoi (sécurité et filtrage)
  beforeSend(event) {
    // Filtrer les informations sensibles
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.value) {
        // Masquer les mots de passe
        if (error.value.includes('password') || error.value.includes('token')) {
          error.value = error.value.replace(/password[=:]\s*["']?[^"'\s]+["']?/gi, 'password=***');
          error.value = error.value.replace(/token[=:]\s*["']?[^"'\s]+["']?/gi, 'token=***');
        }
      }
    }
    
    // Ajouter des contextes métier
    if (event.request && event.request.url) {
      event.tags = {
        ...event.tags,
        endpoint_type: getEndpointType(event.request.url)
      };
    }
    
    // Ajouter des informations sur l'environnement
    event.tags = {
      ...event.tags,
      app_layer: 'backend-api',
      deployment_type: process.env.DEPLOYMENT_TYPE || 'standalone'
    };
    
    return event;
  },

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

// Fonction pour créer des transactions avec contexte métier - VERSION MODERNE
const createBusinessTransaction = (operation, name, context = {}) => {
  return Sentry.startTransaction({
    op: operation,
    name: name,
    tags: {
      business_operation: operation,
      ...context
    },
    data: {
      timestamp: new Date().toISOString(),
      ...context
    }
  });
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

// Fonction pour logger les événements d'audit
const logAuditEvent = (action, userId, targetType, targetId, details = {}) => {
  Sentry.addBreadcrumb({
    message: `Audit: ${action}`,
    category: 'audit',
    level: 'info',
    data: {
      action,
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      timestamp: new Date().toISOString(),
      details
    }
  });
};

// Fonction pour capturer les erreurs métier avec contexte
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

// Gestionnaire d'erreurs async avec Sentry - VERSION MODERNE
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // Capturer l'erreur avec le contexte de la requête
    Sentry.withScope((scope) => {
      scope.setTag('endpoint', req.route?.path || req.path);
      scope.setTag('method', req.method);
      scope.setTag('user_role', req.user?.role);
      
      scope.setContext('request_data', {
        body: req.body,
        params: req.params,
        query: req.query,
        user_id: req.user?.id
      });
      
      Sentry.captureException(error);
    });
    next(error);
  });
};

console.log(`🔍 Sentry initialisé pour HomeCyclHome - Environnement: ${process.env.NODE_ENV || 'development'}`);

module.exports = {
  Sentry,
  sentryUserContextMiddleware,
  createBusinessTransaction,
  trackBusinessMetric,
  logAuditEvent,
  captureBusinessError,
  asyncHandler
};