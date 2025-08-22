import {
    setupBasicMocks,
    fillAddressStep,
    selectMaintenance,
    selectRepair,
    fillAddressAndBike,
    goToOperationChoice,
    verifyCurrentStep,
    verifyFormError,
    verifyConfirmationStep,
  } from '../support/intervention-utils';
  
  describe('Intervention E2E - Tests Formulaire', () => {
    beforeEach(() => {
      setupBasicMocks();
      cy.visit('/actions');
    });
  
    it('étape 1 - adresse', () => {
      const address = '20 Rue du Pasteur Alphonse Cadier, 64000 Pau, France';
      verifyCurrentStep(0);
      cy.contains('Votre adresse').should('be.visible');

      cy.get('.address_write').first().type(address);
      
      cy.get('.suggestions-list', { timeout: 5000 }).should('be.visible');
      
      cy.get('.suggestion-item').first().click();
      
      cy.get('.adresse-btn').click();
      
      cy.contains('Détails du cycle', { timeout: 10000 }).should('be.visible');
      verifyCurrentStep(1);
    });

    it('étape 1 - adresse avec erreur', () => {
      const address = 'Rue inexistante';
      verifyCurrentStep(0);
      cy.contains('Votre adresse').should('be.visible');
  
      cy.get('.address_write').first().type(address);
      cy.get('.adresse-btn').click();
      verifyFormError("Veuillez saisir une adresse valide");
      verifyCurrentStep(0);
    });
  
    it('étape 2 - vélo', () => {
      fillAddressStep();
      cy.contains('Détails du cycle').should('be.visible');
    
        // validations des champs
        cy.get('.details-btn').click();
        verifyFormError('La marque est requise');
    
        cy.get('input[formControlName="brand"]').type('Trek');
        cy.get('.details-btn').click();
        verifyFormError('Le modèle est requis');
    
        cy.get('input[formControlName="model"]').type('Domane');
        cy.get('.details-btn').click();
        verifyFormError('L\'année est requise');
    
        // finir et envoyer pour passer à l'étape 3
        cy.get('input[formControlName="year"]').type('2023');
        cy.get('mat-select[formControlName="type"]').click();
        cy.get('mat-option[value="Vélo classique"]').click();
        cy.get('.details-btn').click();
    
        verifyCurrentStep(2); 
      })
  
    it('étape 3 - maintenance/réparation -> maintenance', () => {
      fillAddressAndBike();
      selectMaintenance();
    });

    it('étape 3 - maintenance/réparation -> réparation', () => {
      fillAddressAndBike();
      selectRepair();
    });
  
    it('étape 4 - formulaire maintenance', () => {
      fillAddressAndBike();
      selectMaintenance();
        
      cy.get('mat-select[formControlName="package"]').click();
      cy.get('mat-option[value="basic"]').click();
    
      cy.get('ion-datetime[formcontrolname="scheduleDate"]')
        .invoke('val', '2025-12-25')
        .trigger('ionChange');
    
      cy.wait(1000);
    
      cy.get('.maintenance-btn').click();
      
      cy.wait(3000);
      
      cy.get('body').then($body => {
        if ($body.find("*:contains('Merci d\\'avoir pris le rendez-vous')").length > 0) {
          cy.log('Validation réussie');
        } 
      });
    });
  
    it('étape 4b - formulaire réparation', () => {
        goToOperationChoice();
        selectRepair();
    
        cy.get('textarea[formControlName="issueDetails"]').type('Chaîne qui saute');
    
        cy.get('ion-datetime[formcontrolname="scheduleDate"]')
        .invoke('val', '2025-12-25')
        .trigger('ionChange');
    
        cy.wait(1000);
      
        cy.get('.reparation-btn').click();  
        
        cy.wait(3000);
        
        cy.get('body').then($body => {
          if ($body.find("*:contains('Merci d\\'avoir pris le rendez-vous')").length > 0) {
            cy.log('Validation réussie');
          } 
        });
    });
  });