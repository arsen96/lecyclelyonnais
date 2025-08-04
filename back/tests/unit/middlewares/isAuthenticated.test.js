const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

// Import du middleware à tester
const isAuthenticated = require('../../../src/middlewares/isAuthenticated');

describe('🔐 isAuthenticated Middleware', () => {
  let req, res, next, jwtStub;

  beforeEach(() => {
    // Setup des mocks pour chaque test
    req = {
      headers: {}
    };
    res = {
      status: sinon.stub().returnsThis(), // this pour pouvoir chainer les methodes
      json: sinon.spy()
    };  // exemple  res.status(401).json({...});
    next = sinon.spy();
    
    // Stub JWT pour contrôler son comportement
    jwtStub = sinon.stub(jwt, 'verify');
  });

  afterEach(() => {
    // Nettoyer les stubs après chaque test
    sinon.restore();
  });

  describe('Valid Token Cases', () => {
    it('should allow access with valid Bearer token', () => {
      // ARRANGE
      const validPayload = { id: 1, email: 'test@test.com', role: 'technician' };
      req.headers.authorization = 'Bearer validtoken123';
      jwtStub.returns(validPayload);

      // ACT
      isAuthenticated(req, res, next);

      // ASSERT
      expect(next.calledOnce).to.be.true;
      expect(req.user).to.deep.equal(validPayload);
      expect(res.status.called).to.be.false;
    });

    it('should extract user info from token payload', () => {
      // ARRANGE
      const userPayload = { 
        id: 66, 
        email: 'kubatarsen@gmail.com', 
        role: 'technician' 
      };
      req.headers.authorization = 'Bearer somevalidtoken';
      jwtStub.returns(userPayload);

      // ACT
      isAuthenticated(req, res, next);

      // ASSERT
      expect(req.user.id).to.equal(66);
      expect(req.user.email).to.equal('kubatarsen@gmail.com');
      expect(req.user.role).to.equal('technician');
    });
  });

  describe('Security', () => {
    it('should reject empty Bearer token', () => {
      // ARRANGE
      req.headers.authorization = 'Bearer ';

      // ACT
      isAuthenticated(req, res, next);

      // ASSERT
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ 
        success: false, 
        message: 'invalidtoken' 
      })).to.be.true;
      expect(next.called).to.be.false;
    });

    it('should reject Bearer without token', () => {
      // ARRANGE
      req.headers.authorization = 'Bearer';

      // ACT
      isAuthenticated(req, res, next);

      // ASSERT
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ 
        success: false, 
        message: 'invalidtoken' 
      })).to.be.true;
      expect(next.called).to.be.false;
    });

  });
});