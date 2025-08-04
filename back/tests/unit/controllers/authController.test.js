const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const proxyquire = require('proxyquire');

describe('🔐 AuthController - Tests Unitaires Simple', () => {
  let req, res, bcryptStub, jwtStub, poolMock, authController;

  beforeEach(() => {
    // Objets fake pour req et res
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    
    // Stubs pour les dépendances externes
    bcryptStub = sinon.stub(bcrypt, 'compare');
    jwtStub = sinon.stub(jwt, 'sign');
    
    // Mock de la base de données - Version qui marche !
    poolMock = {
      query: sinon.stub()
    };
    
    
    // Import du controller avec les mocks injectés
    authController = proxyquire('../../../src/controllers/authController', {
      '../config/db': poolMock
    });
  });

  afterEach(() => {
    sinon.restore(); // Nettoie tous les stubs
  });

  // ================================================================
  // TEST 1 : LOGIN RÉUSSI
  // ================================================================
  describe('login() - Cas de succès', () => {
    it('should return token when login is successful', async () => {
      // ARRANGE - Préparer les données
      req.body = {
        email: 'test@test.com',
        password: 'password123',
        domain: 'localhost'
      };


      // Mock: la base trouve l'utilisateur (client)
      poolMock.query.onFirstCall().resolves({
        rows: [{
          id: 1,
          email: 'test@test.com',
          password: 'hashedPassword',
          first_name: 'John'
        }]
      });

      // Mock: le mot de passe est correct
      bcryptStub.resolves(true);

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
    });
  });

  // ================================================================
  // TEST 2 : LOGIN ÉCHOUÉ - Email incorrect
  // ================================================================
  describe('login() - Cas d\'échec', () => {
    it('should reject login with wrong email', async () => {
      // ARRANGE
      req.body = {
        email: 'wrong@email.com',
        password: 'password123',
        domain: 'localhost'
      };


      // Mock: la base ne trouve PAS l'utilisateur (ni client ni technician)
      // On ne precise pas onFirstCall comme ça tous les appels à query vont retourner []
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


      // Mock: la base trouve l'utilisateur
      poolMock.query.onFirstCall().resolves({
        rows: [{
          id: 1,
          email: 'test@test.com',
          password: 'hashedPassword'
        }]
      });

      // Mock: le mot de passe est incorrect
      bcryptStub.resolves(false);

      // ACT
      await authController.login(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Mot de passe incorrect"
      })).to.be.true;
    });
  });

  // ================================================================
  // TEST 3 : REGISTER RÉUSSI
  // ================================================================
  describe('register() - Cas simple', () => {
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


      // Mock: email n'existe pas encore (client)
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: email n'existe pas encore (technician)  
      poolMock.query.onSecondCall().resolves({ rows: [{ exists: false }] });
      
      // Mock: création réussie
      poolMock.query.onThirdCall().resolves({
        rows: [{
          id: 1,
          email: 'new@test.com',
          first_name: 'John'
        }]
      });

      // Mock: JWT token
      jwtStub.returns('new-user-token');

      // ACT
      await authController.register(req, res);

      // ASSERT
      expect(res.status.calledWith(201)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.token).to.equal('new-user-token');
    });

    it('should reject registration with existing email', async () => {
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


      // Mock: email existe déjà  
      poolMock.query.onFirstCall().resolves({
        rows: [{ email: 'existing@test.com' }] // Email trouvé
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
  });
});