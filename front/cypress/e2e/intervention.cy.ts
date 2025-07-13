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
  
      cy.get('.adresse-btn').click();
      verifyFormError("L'adresse est requise");
  
      cy.get('.adresse-input').type(address);
      cy.window().then((win:any) => {
        const mockPlace = {
          geometry: { location: { lat: 43.2951, lng: -0.3707 } },
          formatted_address: address
        };
        
        const component = win.ng.getComponent(win.document.querySelector('app-actions'));
        component.handleAddressChange(mockPlace);
        component.cd.detectChanges();
        cy.get('.adresse-btn').click();

        cy.wait('@validateAddress');
        verifyCurrentStep(1);
      });
    });

    it('étape 1 - adresse avec erreur', () => {
      const address = "Rue inexistante";
      verifyCurrentStep(0);
      cy.contains('Votre adresse').should('be.visible');
  
      cy.get('.adresse-btn').click();
      verifyFormError("L'adresse est requise");
  
      cy.get('.adresse-input').type(address);
        cy.get('.adresse-btn').click();
        cy.wait('@validateAddress');
        verifyCurrentStep(1);
    });
  
    it('étape 2 - vélo', () => {
      fillAddressStep().then(() => {
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
    });
  
    it('étape 3 - maintenance/réparation -> maintenance', () => {
      // Aller au choix d'opération
      fillAddressAndBike().then(() => {
        cy.contains('Choisissez une opération').should('be.visible');
        selectMaintenance();
        })
    });

    it('étape 3 - maintenance/réparation -> réparation', () => {
      // Aller au choix d'opération
      fillAddressAndBike().then(() => {
        selectRepair();
        })
    });
  
    it('étape 4 - formulaire maintenance', () => {
      fillAddressAndBike().then(() => {
        selectMaintenance();
        
        cy.get('mat-select[formControlName="package"]').click();
        cy.get('mat-option[value="basic"]').click();
    
        cy.window().then((win: any) => {
          const component = win.ng.getComponent(win.document.querySelector('app-actions'));
          component.globalService.isAuthenticated = {
            getValue: () => true
          };
          
          // Forcer la selection de date et d'heure
          component.maintenanceFormGroup.patchValue({
            scheduleDate: '2024-12-25',
            scheduleTime: '09:00 - 11:00'
          });
        });
    
        cy.get('.maintenance-btn').click();
        cy.wait('@createIntervention');
        verifyConfirmationStep();
      })
    });
  
    it('étape 4b - formulaire réparation', () => {
      goToOperationChoice().then(() => {
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
      })
    });
  

  });