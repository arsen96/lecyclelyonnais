export const testData = {
    validAddress: '20 Rue du Pasteur Alphonse Cadier, 64000 Pau, France',
    validBike: {
      brand: 'Trek',
      model: 'Domane',
      year: '2023',
      type: 'Vélo classique'
    },
  };
  
  
  export const setupBasicMocks = () => {
    // Mock validation adresse
    cy.intercept('POST', '**/zones/isAddressInZone', {
      statusCode: 200,
      body: { success: 1, message: 'Adresse validée' }
    }).as('validateAddress');
  
    // Mock zones
    // Mock vélos utilisateur
    cy.intercept('GET', '**/bicycles/user', {
      statusCode: 200,
      body: [{
        id: 1,
        brand: 'Trek',
        model: 'Domane',
        year: '2023',
        type: 'Vélo classique'
      }]
    }).as('getUserBikes');
  
    // Mock création intervention
    cy.intercept('POST', '**/interventions/save', {
      statusCode: 200,
      body: { success: true, message: 'Intervention créée avec succès' }
    }).as('createIntervention');
  };
  
  
  export const fillAddressStep = () => {
    return new Promise<void>((resolve, reject) => {
      cy.get('.adresse-input').clear().type(testData.validAddress);
      cy.window().then((win:any) => {
        const mockPlace = {
          geometry: { location: { lat: 43.3000, lng: -0.3700 } }, 
          formatted_address: testData.validAddress
        };
        
        const component = win.ng.getComponent(win.document.querySelector('app-actions'));
        component.handleAddressChange(mockPlace);
        component.cd.detectChanges();
        cy.get('.adresse-btn').click();
        cy.wait('@validateAddress');
        resolve();
      });
    });
  }
  
  export const fillBikeDetails = () => {
    cy.get('input[formControlName="brand"]').clear().type(testData.validBike.brand);
    cy.get('input[formControlName="model"]').clear().type(testData.validBike.model);
    cy.get('input[formControlName="year"]').clear().type(testData.validBike.year);
    cy.get('mat-select[formControlName="type"]').click();
    cy.get(`mat-option[value="${testData.validBike.type}"]`).click();
    cy.get('.details-btn').click();
  };
  
  export const selectMaintenance = () => {
    cy.get('mat-radio-button[value="maintenance"]').click();
    cy.get('.operation-btn').click();
  };
  
  export const selectRepair = () => {
    cy.get('mat-radio-button[value="reparation"]').click();
    cy.get('.operation-btn').click();
  };
  
  export const verifyCurrentStep = (stepIndex: number) => {
    // verifier si  attribut aria-selected est true
    cy.get(`mat-step-header:nth-child(${stepIndex + 1})`).should('have.attr', 'aria-selected', 'true');
  };
  
  export const verifyFormError = (message: string) => {
    cy.contains(message).should('be.visible');
  };
  
  export const verifyConfirmationStep = () => {
    cy.contains("Merci d'avoir pris le rendez-vous !").should('be.visible');
  };
  

  
  // Workflows partiels pour les tests
  export const fillAddressAndBike = () => {
    return new Promise<void>((resolve, reject) => {
      fillAddressStep().then(() => {
        fillBikeDetails();
        resolve();
      });
    });
  };
  
  export const goToOperationChoice = () => {
    return new Promise<void>((resolve, reject) => {
      fillAddressAndBike().then(() => {
        resolve();
      });
    });
  };
  

  export const setupErrorMocks = () => {
    cy.intercept('POST', '**/zones/is-address-in-zone', {
      statusCode: 400,
      body: { success: false, message: 'Adresse non desservie' }
    }).as('addressError');
    
    cy.intercept('POST', '**/interventions', {
      statusCode: 400,
      body: { success: false, message: 'Aucun technicien disponible' }
    }).as('interventionError');
  };