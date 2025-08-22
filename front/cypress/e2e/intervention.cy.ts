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
      // cy.intercept('POST', '**/auth/login', {
      //   statusCode: 200,
      //   body: {
      //     token: 'fake-jwt-token-client',
      //     data: {
      //       user: {
      //         id: 1,
      //         first_name: 'Client',
      //         last_name: 'Test',
      //         email: 'client.test@test.com',
      //         role: 'client'
      //       }
      //     }
      //   }
      // }).as('loginSuccess');
    
    
      // cy.visit('/login');
      // cy.get('.emailLogin').type('client.test@test.com');
      // cy.get('.passwordLogin').type('password123');
      // cy.get('.loginButton').click();
      // cy.wait('@loginSuccess');
      // cy.url().should('include', '/interventions');
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
      // const address = '20 Rue du Pasteur Alphonse Cadier, 64000 Pau, France';
      // verifyCurrentStep(0);
      // cy.contains('Votre adresse').should('be.visible');
  
      // cy.get('.address_write').first().type(address);
      // cy.window().then((win: any) => {
      //   const mockPlace = {
      //     label: address,
      //   };
        
      //   const component = win.ng.getComponent(win.document.querySelector('app-actions'));
      //   component.handleAddressChange(mockPlace);
      //   component.cd.detectChanges();
      //   cy.get('.adresse-btn').click();
  
      //   cy.wait('@validateAddress'); 
      //   verifyCurrentStep(1);
      });
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
      // Aller au choix d'opération
      fillAddressAndBike();
      selectMaintenance();
    });

    it('étape 3 - maintenance/réparation -> réparation', () => {
      // Aller au choix d'opération
      fillAddressAndBike();
      selectRepair();
    });
  
    it('étape 4 - formulaire maintenance', () => {
      // fillAddressAndBike();
      // selectMaintenance();
        
      //   cy.get('mat-select[formControlName="package"]').click();
      //   cy.get('mat-option[value="basic"]').click();
    
      //   cy.window().then((win: any) => {
      //     const component = win.ng.getComponent(win.document.querySelector('app-actions'));
      //     component.globalService.isAuthenticated = {
      //       getValue: () => true
      //     };
          
      //     // Forcer la selection de date et d'heure
      //     component.maintenanceFormGroup.patchValue({
      //       scheduleDate: '2024-12-25',
      //       scheduleTime: '09:00 - 11:00'
      //     });
      //   });
    
      //   cy.get('.maintenance-btn').click();
      //   cy.wait('@createIntervention');
      //   verifyConfirmationStep();

      fillAddressAndBike();
      selectMaintenance();
        
      cy.get('mat-select[formControlName="package"]').click();
      cy.get('mat-option[value="basic"]').click();

      cy.get('[data-cy="schedule-date"]').click(); 
      cy.get('.calendar-day[data-date="2024-12-25"]').click(); 
      
      cy.get('[data-cy="schedule-time"]').click();
      cy.contains('09:00 - 11:00').click();

      cy.get('.maintenance-btn').click();
      cy.wait('@createIntervention');
      verifyConfirmationStep();
    })
  
    it('étape 4b - formulaire réparation', () => {
        goToOperationChoice();
        selectRepair();
    
        cy.get('textarea[formControlName="issueDetails"]').type('Chaîne qui saute');
    
        cy.window().then((win: any) => {
          const component = win.ng.getComponent(win.document.querySelector('app-actions'));
          component.globalService.isAuthenticated = {
            getValue: () => true
          };
          
          // Forcer la selection de date et d'heure 
          component.repairFormGroup.patchValue({
            scheduleDate: '2024-12-25',
            scheduleTime: '09:00 - 11:00'
          });
        });
    
        cy.get('.reparation-btn').click();  
        cy.wait('@createIntervention');
        verifyConfirmationStep();
    });