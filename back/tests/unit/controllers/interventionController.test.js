const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('🔧 InterventionController - Tests Unitaires', () => {
  let req, res, poolMock, multerMock, sentryMock, interventionController;

  beforeEach(() => {
    req = { 
      headers: {},
      body: {},
      files: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };
    
    poolMock = { query: sinon.stub() };
    multerMock = sinon.stub().returns({
      fields: () => (req, res, cb) => cb(null), // Mock for manageEnd
      array: () => (req, res, cb) => cb(null)  // Mock for save
    });
    sentryMock = {
      trackBusinessMetric: sinon.stub(),
      captureBusinessError: sinon.stub()
    };
    
    interventionController = proxyquire('../../../src/controllers/interventionController', {
      '../config/db': poolMock,
      '../config/sentry': sentryMock,
      'multer': multerMock
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  // ================================================================
  // TEST manageEnd - CAS DE SUCCÈS
  // ================================================================
  describe('manageEnd() - Succès', () => {
    it('should cancel intervention successfully', async () => {
      // ARRANGE
      req.headers.authorization = 'Bearer validToken123';
      req.body = {
        intervention_id: '3',
        is_canceled: 'true',
        comment: 'Annulation demandée par le client'
      };

      poolMock.query.resolves();

      // ACT
      await interventionController.manageEnd(req, res);

      // ASSERT
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({
        success: true,
        message: "Intervention annulée"
      })).to.be.true;
      expect(sentryMock.trackBusinessMetric.calledWith(
        'intervention.canceled',
        1,
        { intervention_id: '3', has_photos: false }
      )).to.be.true;
    });
  });

  // ================================================================
  // TEST manageEnd - CAS D'ÉCHEC
  // ================================================================
  describe('manageEnd() - Échecs', () => {


    it('should handle database error during intervention update', async () => {
      // ARRANGE
      req.headers.authorization = 'Bearer validToken123';
      req.body = {
        intervention_id: '1',
        is_canceled: 'false',
        comment: 'Test'
      };

      const dbError = new Error('Database connection failed');
      poolMock.query.rejects(dbError);

      // ACT
      await interventionController.manageEnd(req, res);

      // ASSERT
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith({
        success: false,
        message: "Erreur lors de l'annulation de l'intervention"
      })).to.be.true;
      expect(sentryMock.captureBusinessError.calledWith(
        dbError,
        'intervention.manage_end.failed'
      )).to.be.true;
    });
  });
});