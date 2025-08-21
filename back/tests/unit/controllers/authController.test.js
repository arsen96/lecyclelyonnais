const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const proxyquire = require('proxyquire');

describe(' AuthController - Tests Unitaires', () => {
  let req, res, bcryptHashStub, bcryptCompareStub, jwtStub, poolMock, subdomainInfoStub, authController;

  beforeEach(() => {
    // Mock console.error pour nettoyer l'affichage
    sinon.stub(console, 'error');
    
    // Objets fake pour req et res
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    
    // Mocks des dépendances externes
    bcryptHashStub = sinon.stub();
    bcryptCompareStub = sinon.stub();
    jwtStub = sinon.stub();
    subdomainInfoStub = sinon.stub().resolves(1);
    
    // Mock de la base de données
    poolMock = {
      query: sinon.stub()
    };
    
    // Import du controller avec proxyquire pour mocker TOUTES les dépendances
    authController = proxyquire('../../../src/controllers/authController', {
      '../config/db': poolMock,
      'bcryptjs': {
        hash: bcryptHashStub,
        compare: bcryptCompareStub
      },
      'jsonwebtoken': {
        sign: jwtStub
      },
      '../controllers/companyController': {
        subdomainInfo: subdomainInfoStub
      },
      'crypto': {
        randomBytes: sinon.stub().returns({ toString: () => 'fake-reset-token' })
      },
      'nodemailer': {
        createTransporter: sinon.stub().returns({
          sendMail: sinon.stub().callsArgWith(1, null, { response: 'Email sent' })
        })
      }
    });
  });

  afterEach(() => {
    sinon.restore(); // Nettoie tous les stubs
  });

  // ================================================================
  // TEST LOGIN - CAS DE SUCCÈS
  // ================================================================
  describe('login() - Cas de succès', () => {
    it('should return token when client login is successful', async () => {
      // ARRANGE - Préparer les données
      req.body = {
        email: 'client@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      const mockClient = {
        id: 1,
        email: 'client@test.com',
        password: 'hashedPassword',
        first_name: 'John'
      };

      // Mock: subdomainInfo retourne company_id = 1
      subdomainInfoStub.resolves(1);

      // Mock: la base trouve le client
      poolMock.query.onFirstCall().resolves({
        rows: [mockClient]
      });

      // Mock: le mot de passe est correct
      bcryptCompareStub.resolves(true);

      // Mock: JWT génère un token
      jwtStub.returns('fake-jwt-token');

      // ACT - Exécuter le login
      await authController.login(req, res);

      // ASSERT - Vérifier le résultat
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.token).to.equal('fake-jwt-token');
      expect(response.data.user.role).to.equal('client');
    });

    it('should return token when technician login is successful', async () => {
      // ARRANGE
      req.body = {
        email: 'tech@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      const mockTechnician = {
        id: 2,
        email: 'tech@test.com',
        password: 'hashedPassword',
        first_name: 'Jane'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: client pas trouvé, technician trouvé
      poolMock.query.onFirstCall().resolves({ rows: [] }); // Client query
      poolMock.query.onSecondCall().resolves({ rows: [mockTechnician] }); // Technician query

      // Mock: password correct
      bcryptCompareStub.resolves(true);
      
      // Mock: JWT token
      jwtStub.returns('tech-jwt-token');

      // ACT
      await authController.login(req, res);

      // ASSERT
      expect(res.status.calledWith(201)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.token).to.equal('tech-jwt-token');
      expect(response.data.user.role).to.equal('technician');
    });
  });

  // ================================================================
  // TEST LOGIN - CAS D'ÉCHEC
  // ================================================================
  describe('login() - Cas d\'échec', () => {
    it('should reject login with wrong email', async () => {
      // ARRANGE
      req.body = {
        email: 'wrong@email.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: ni client ni technician trouvé
      poolMock.query.resolves({ rows: [] }); 

      // ACT
      await authController.login(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "L'email est incorrect"
      })).to.be.true;
    });

    it('should reject login with wrong password', async () => {
      // ARRANGE
      req.body = {
        email: 'test@test.com',
        password: 'wrongPassword',
        domain: 'localhost'
      };

      const mockClient = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: client trouvé
      poolMock.query.onFirstCall().resolves({
        rows: [mockClient]
      });

      // Mock: mot de passe incorrect
      bcryptCompareStub.resolves(false);

      // ACT
      await authController.login(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Mot de passe incorrect"
      })).to.be.true;
    });

    it('should handle database errors during login', async () => {
      // ARRANGE
      req.body = {
        email: 'test@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: erreur de base de données
      poolMock.query.rejects(new Error('Database connection failed'));

      // ACT
      await authController.login(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.status).to.equal('error');
    });
  });

  // ================================================================
  // TEST REGISTER - CAS DE SUCCÈS
  // ================================================================
  describe('register() - Cas de succès', () => {
    it('should create user successfully', async () => {
      // ARRANGE
      req.body = {
        email: 'new@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '0123456789',
        address: '123 rue test',
        domain: 'localhost'
      };

      const newUser = {
        id: 1,
        email: 'new@test.com',
        first_name: 'John',
        last_name: 'Doe'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: email n'existe pas encore (client)
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: email n'existe pas encore (technician)  
      poolMock.query.onSecondCall().resolves({ rows: [{ exists: false }] });
      
      // Mock: création réussie
      poolMock.query.onThirdCall().resolves({
        rows: [newUser]
      });

      // Mock: password hashé
      bcryptHashStub.resolves('hashedPassword123');

      // Mock: JWT token
      jwtStub.returns('new-user-token');

      // ACT
      await authController.register(req, res);

      // ASSERT
      expect(res.status.calledWith(201)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.token).to.equal('new-user-token');
      expect(response.data.user.role).to.equal('client');
    });

    it('should reject registration with existing client email', async () => {
      // ARRANGE
      req.body = {
        email: 'existing@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '0123456789',
        address: '123 rue test',
        domain: 'localhost'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: email existe déjà dans clients
      poolMock.query.onFirstCall().resolves({
        rows: [{ email: 'existing@test.com' }]
      });

      // ACT
      await authController.register(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Cet email est déjà utilisé"
      })).to.be.true;
    });

    it('should reject registration with existing technician email', async () => {
      // ARRANGE
      req.body = {
        email: 'tech@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '0123456789',
        address: '123 rue test',
        domain: 'localhost'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: email n'existe pas chez les clients
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: email existe chez les techniciens
      poolMock.query.onSecondCall().resolves({ rows: [{ exists: true }] });

      // ACT
      await authController.register(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Cet email est déjà utilisé"
      })).to.be.true;
    });


    it('should handle database errors during registration', async () => {
      // ARRANGE
      req.body = {
        email: 'new@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '0123456789',
        address: '123 rue test',
        domain: 'localhost'
      };

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Mock: erreur de base de données
      poolMock.query.rejects(new Error('Database error'));

      // ACT
      await authController.register(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.false;
    });
  });

  // ================================================================
  // TEST OAUTH - CAS DE SUCCÈS ET ÉCHEC
  // ================================================================
  describe('oauth() - Tests', () => {
    it('should authenticate user with oauth', async () => {
      // ARRANGE
      req.body = {
        email: 'oauth@test.com'
      };

      const mockUser = {
        id: 1,
        email: 'oauth@test.com',
        password: 'hashedPassword'
      };

      // Mock: utilisateur trouvé
      poolMock.query.resolves({ rows: [mockUser] });
      
      // Mock: JWT token
      jwtStub.returns('oauth-token');

      // ACT
      await authController.oauth(req, res);

      // ASSERT
      expect(res.status.calledWith(201)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.token).to.equal('oauth-token');
    });

    it('should reject oauth for non-existing user', async () => {
      // ARRANGE
      req.body = {
        email: 'nonexistent@test.com'
      };

      // Mock: utilisateur pas trouvé
      poolMock.query.resolves({ rows: [] });

      // ACT
      await authController.oauth(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "L'utilisateur n'existe pas"
      })).to.be.true;
    });
  });
});