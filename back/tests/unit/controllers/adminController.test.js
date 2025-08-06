const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const proxyquire = require('proxyquire');

describe('🔐 AdminController - Tests Unitaires', () => {
  let req, res, poolMock, bcryptStub, subdomainInfoStub, adminController, jwtStub;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    
    // Mocks des dépendances
    poolMock = { query: sinon.stub() };
    bcryptStub = sinon.stub(bcrypt, 'hash');
    subdomainInfoStub = sinon.stub().resolves(1);
    jwtStub = sinon.stub().returns('fake-jwt-token');
    
    // Utiliser proxyquire pour mocker TOUTES les dépendances
    adminController = proxyquire('../../../src/controllers/adminController', {
      '../config/db': poolMock,
      'bcryptjs': {
        hash: bcryptStub,
        compare: sinon.stub().resolves(true) // Mock par défaut pour compare
      },
      'jsonwebtoken': {
        sign: jwtStub
      },
      '../controllers/companyController': {
        subdomainInfo: subdomainInfoStub
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  // ================================================================
  // TEST createAdmin - CAS DE SUCCÈS
  // ================================================================
  describe('createAdmin() - Succès', () => {
    it('should create admin successfully', async () => {
      // ARRANGE
      req.body = {
        first_name: 'John',
        last_name: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: email n'existe pas encore
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: création réussie
      poolMock.query.onSecondCall().resolves();
      
      // Mock: password hashé
      bcryptStub.resolves('hashedPassword123');
      
      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // ACT
      await adminController.createAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "Admin créé avec succès"
      })).to.be.true;
      
      // Vérifier les appels
      expect(subdomainInfoStub.calledWith('localhost')).to.be.true;
      expect(bcryptStub.calledWith('password123', 10)).to.be.true;
    });

    it('should create admin with company_id provided', async () => {
      // ARRANGE
      req.body = {
        first_name: 'John',
        last_name: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        company_id: 5
      };

      // Mock: email n'existe pas encore
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: création réussie
      poolMock.query.onSecondCall().resolves();
      
      // Mock: password hashé
      bcryptStub.resolves('hashedPassword123');

      // ACT
      await adminController.createAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "Admin créé avec succès"
      })).to.be.true;
      
      // Vérifier que subdomainInfo n'a PAS été appelé
      expect(subdomainInfoStub.called).to.be.false;
    });
  });

  // ================================================================
  // TEST createAdmin - EMAIL EXISTE DÉJÀ
  // ================================================================
  describe('createAdmin() - Échec', () => {
    it('should reject when email already exists', async () => {
      // ARRANGE
      req.body = {
        first_name: 'John',
        last_name: 'Admin',
        email: 'existing@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: email existe déjà dans une des 3 tables
      poolMock.query.onFirstCall().resolves({
        rows: [{ email: 'existing@test.com' }]
      });

      // ACT
      await adminController.createAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      // ARRANGE
      req.body = {
        first_name: 'John',
        last_name: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: erreur de base de données
      poolMock.query.rejects(new Error('Database connection failed'));

      // ACT
      await adminController.createAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Erreur lors de la création de l'admin"
      })).to.be.true;
    });
  });

  // ================================================================
  // TEST updateAdmin - CAS DE SUCCÈS
  // ================================================================
  describe('updateAdmin() - Succès', () => {
    it('should update admin successfully with password', async () => {
      // ARRANGE
      req.body = {
        id: 1,
        first_name: 'John',
        last_name: 'Updated',
        email: 'updated@test.com',
        password: 'newPassword123',
        role: 'admin'
      };

      // Mock: email unique (pas trouvé ailleurs)
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: update réussi
      poolMock.query.onSecondCall().resolves();
      
      // Mock: password hashé
      bcryptStub.resolves('newHashedPassword');

      // ACT
      await adminController.updateAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "Admin mis à jour avec succès"
      })).to.be.true;
    });

    it('should update admin successfully without password', async () => {
      // ARRANGE
      req.body = {
        id: 1,
        first_name: 'John',
        last_name: 'Updated',
        email: 'updated@test.com',
        // Pas de password
        role: 'admin'
      };

      // Mock: email unique
      poolMock.query.onFirstCall().resolves({ rows: [] });
      
      // Mock: update réussi
      poolMock.query.onSecondCall().resolves();

      // ACT
      await adminController.updateAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "Admin mis à jour avec succès"
      })).to.be.true;
      
      // Vérifier que bcrypt.hash n'a PAS été appelé
      expect(bcryptStub.called).to.be.false;
    });
  });

  // ================================================================
  // TEST updateAdmin - EMAIL EXISTE DÉJÀ
  // ================================================================
  describe('updateAdmin() - Échec', () => {
    it('should reject when email already exists for another user', async () => {
      // ARRANGE
      req.body = {
        id: 1,
        first_name: 'John',
        last_name: 'Admin',
        email: 'existing@test.com',
        role: 'admin'
      };

      // Mock: email existe déjà pour un autre utilisateur
      poolMock.query.onFirstCall().resolves({
        rows: [{ email: 'existing@test.com' }]
      });

      // ACT
      await adminController.updateAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Un autre utilisateur avec cet email existe déjà"
      })).to.be.true;
    });
  });

  // ================================================================
  // TEST loginAdmin - CAS DE SUCCÈS
  // ================================================================
  describe('loginAdmin() - Succès', () => {
    it('should login admin successfully', async () => {
      // ARRANGE
      req.body = {
        email: 'admin@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        password: 'hashedPassword',
        role: 'admin',
        first_name: 'John'
      };

      // Mock: admin trouvé
      poolMock.query.resolves({
        rows: [mockAdmin]
      });

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Recréer le controller avec bcrypt.compare mocké
      const bcryptCompareMock = sinon.stub().resolves(true);
      adminController = proxyquire('../../../src/controllers/adminController', {
        '../config/db': poolMock,
        'bcryptjs': {
          hash: bcryptStub,
          compare: bcryptCompareMock
        },
        'jsonwebtoken': {
          sign: jwtStub
        },
        '../controllers/companyController': {
          subdomainInfo: subdomainInfoStub
        }
      });

      // ACT
      await adminController.loginAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      
      const response = res.json.firstCall.args[0];
      expect(response.success).to.be.true;
      expect(response.message).to.equal("Connexion réussie");
      expect(response.token).to.equal('fake-jwt-token');
      expect(response.data.user).to.deep.equal({ ...mockAdmin, role: mockAdmin.role });
    });
  });

  // ================================================================
  // TEST loginAdmin - ÉCHECS
  // ================================================================
  describe('loginAdmin() - Échecs', () => {
    it('should reject when admin not found', async () => {
      // ARRANGE
      req.body = {
        email: 'notfound@test.com',
        password: 'password123',
        domain: 'localhost'
      };

      // Mock: admin pas trouvé
      poolMock.query.resolves({ rows: [] });
      
      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // ACT
      await adminController.loginAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Utilisateur non trouvé"
      })).to.be.true;
    });

    it('should reject when password is incorrect', async () => {
      // ARRANGE
      req.body = {
        email: 'admin@test.com',
        password: 'wrongPassword',
        domain: 'localhost'
      };

      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        password: 'hashedPassword',
        role: 'admin'
      };

      // Mock: admin trouvé
      poolMock.query.resolves({
        rows: [mockAdmin]
      });

      // Mock: subdomainInfo
      subdomainInfoStub.resolves(1);

      // Recréer le controller avec bcrypt.compare mocké pour false
      const bcryptCompareMock = sinon.stub().resolves(false);
      adminController = proxyquire('../../../src/controllers/adminController', {
        '../config/db': poolMock,
        'bcryptjs': {
          hash: bcryptStub,
          compare: bcryptCompareMock
        },
        'jsonwebtoken': {
          sign: jwtStub
        },
        '../controllers/companyController': {
          subdomainInfo: subdomainInfoStub
        }
      });

      // ACT
      await adminController.loginAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Mot de passe incorrect"
      })).to.be.true;
    });
  });

  // ================================================================
  // TEST getAdmins
  // ================================================================
  describe('getAdmins() - Tests', () => {
    it('should return all admins successfully', async () => {
      // ARRANGE
      const mockAdmins = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@test.com' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@test.com' }
      ];

      poolMock.query.resolves({ rows: mockAdmins });

      // ACT
      await adminController.getAdmins(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: mockAdmins
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      // ARRANGE
      poolMock.query.rejects(new Error('Database error'));

      // ACT
      await adminController.getAdmins(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Erreur lors de la récupération des admins"
      })).to.be.true;
    });
  });

  // ================================================================
  // TEST deleteAdmin
  // ================================================================
  describe('deleteAdmin() - Tests', () => {
    it('should delete admins successfully', async () => {
      // ARRANGE
      req.body = { ids: [1, 2, 3] };
      poolMock.query.resolves();

      // ACT
      await adminController.deleteAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "Admins supprimés avec succès"
      })).to.be.true;
      
      // Vérifier la requête
      expect(poolMock.query.calledWith(
        "DELETE FROM administrator WHERE id = ANY($1::int[])",
        [[1, 2, 3]]
      )).to.be.true;
    });

    it('should handle database errors during deletion', async () => {
      // ARRANGE
      req.body = { ids: [1] };
      poolMock.query.rejects(new Error('Delete failed'));

      // ACT
      await adminController.deleteAdmin(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "Erreur lors de la suppression des admins"
      })).to.be.true;
    });
  });
});
