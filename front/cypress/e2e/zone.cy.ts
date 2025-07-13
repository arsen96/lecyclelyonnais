import { environment } from 'src/environments/environment';
import {
  setupZoneMocks,
  verifyZonesList,
  searchZone,
  verifyEmptyState,
  setupErrorMocks,
  deleteZoneByName,
  verifyZoneCount,
  verifyZoneNotVisible,
  selectZoneByName,
  deleteSelectedZones,
  verifyZoneVisible
} from '../support/zone-utils';


describe('Zones E2E - Tests Zone List', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', environment.test_authToken);
      win.localStorage.setItem('userRole', environment.test_userRole);  
      win.localStorage.setItem('access_token', environment.test_access_token);
      win.localStorage.setItem('clientBasicAuth', environment.test_clientBasicAuth);
    });
    setupZoneMocks();
    cy.visit('/list-zones');
  });

  it('devrait charger et afficher la liste des zones', () => {
    verifyZonesList();
    cy.contains('Billere').should('be.visible');
  });

  it('devrait filtrer les zones par nom', () => {
    verifyZonesList();
    searchZone('Billere');
    cy.contains('Billere').should('be.visible');
  });


  it('devrait supprimer une zone individuelle', () => {
    verifyZonesList();
    
    deleteZoneByName('Université de Pau');
    cy.wait('@deleteZones');
    verifyZoneCount(2);
    verifyZoneNotVisible('Université de Pau');
  });


  it('devrait supprimer plusieurs zones sélectionnées', () => {
    verifyZonesList();
    
    // Sélectionner deux zones
    selectZoneByName('Université de Pau');
    selectZoneByName('alsace lorraine');
    
    // Supprimer les zones sélectionnées
    deleteSelectedZones();
    
    cy.wait('@deleteZones');
    verifyZoneCount(1);
    verifyZoneNotVisible('Université de Pau');
    verifyZoneNotVisible('alsace lorraine');
    verifyZoneVisible('Billere');
  });


  it('devrait gérer les erreurs de chargement', () => {
    setupErrorMocks();
    cy.reload();
    
    cy.wait('@getZonesError');
    cy.wait(1000);
    verifyEmptyState();
  });

  it('devrait gérer les erreurs de suppression', () => {
    verifyZonesList();
    
    cy.intercept('POST', '**/zones/delete', {
      statusCode: 500,
      body: { success: false, message: 'Erreur lors de la suppression' }
    }).as('deleteZoneError');
    
    deleteZoneByName('Université de Pau');
    cy.wait('@deleteZoneError');
    verifyZoneCount(3)
  });
});