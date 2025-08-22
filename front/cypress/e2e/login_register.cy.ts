import {
  fillLoginForm,
  fillRegisterForm,
  submitLoginForm,
  submitRegisterForm,
  mockLoginResponse,
  mockRegisterResponse,
  verifyApiRequest,
  verifyErrorMessage,
  verifyRedirect,
  verifyStayOnLoginPage,
  verifyLoginButtonState,
  testUsers
} from '../support/login_register-utils';

describe('Test Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('DOM element chargé', () => {
    cy.get('body').should('be.visible');
    cy.contains('Déjà client ?').should('be.visible');
    cy.contains('Nouveau compte').should('be.visible');
  });

  it('Afficher les champs de connexion', () => {
    cy.get('ion-input[name="email"]').should('be.visible');
    cy.get('ion-input[name="password"]').should('be.visible');
    cy.get('ion-button[type="submit"]').should('be.disabled');
  });

  it("Afficher les champs d'inscription", () => {
    cy.get('ion-input[formControlName="firstName"]').should('exist');
    cy.get('ion-input[formControlName="lastName"]').should('exist');
    cy.get('ion-input[formControlName="email"]').should('exist');
    cy.get('ion-input[formControlName="password"]').should('exist');
    cy.get('ion-input[formControlName="phone"]').should('exist');
  });

  it('Permet de saisir dans les champs', () => {
    fillLoginForm(testUsers.validClient);
    verifyLoginButtonState(false);
  });

  it('Valide le format email', () => {
    cy.get('.emailLogin').type('email-invalide');
    cy.get('.passwordLogin').type(testUsers.validClient.password);
    verifyLoginButtonState(true);
  });

  it('Connexion client valide', () => {
    mockLoginResponse(200, {
      token: 'fake-jwt-token-client',
      data: {
        user: {
          id: 1,
          first_name: 'Client',
          last_name: 'Test',
          email: testUsers.validClient.email,
          role: 'client'
        }
      }
    }, 'successClientLogin');

    fillLoginForm(testUsers.validClient);
    submitLoginForm();
    
    verifyApiRequest('successClientLogin', {
      email: testUsers.validClient.email,
      password: testUsers.validClient.password
    });
    
    verifyRedirect('/interventions');
  });

  it('Utilisateur inexistant', () => {
    mockLoginResponse(404, {
      success: false,
      message: "L'email est incorrect"
    }, 'userNotFound');

    fillLoginForm({
      email: 'utilisateur-inexistant@test.com',
      password: 'password123'
    });
    submitLoginForm();
    
    cy.wait('@userNotFound');
    verifyStayOnLoginPage();
    verifyErrorMessage("L'email est incorrect");
  });

  it('Erreur serveur interne', () => {
    mockLoginResponse(500, {
      status: 'error',
      message: 'Erreur interne du serveur'
    }, 'serverError');

    fillLoginForm(testUsers.validClient);
    submitLoginForm();
    
    cy.wait('@serverError');
    verifyStayOnLoginPage();
    verifyErrorMessage('Erreur interne du serveur');
  });

  it('Inscription réussie', () => {
    mockRegisterResponse(201, {
      success: true,
      token: 'fake-jwt-token-register',
      data: {
        user: {
          id: 2,
          first_name: testUsers.newUser.firstName,
          last_name: testUsers.newUser.lastName,
          email: testUsers.newUser.email,
          role: 'client',
          phone: testUsers.newUser.phone,
          address: testUsers.newUser.address
        }
      }
    }, 'successRegister');
    fillRegisterForm(testUsers.newUser);
    submitRegisterForm();
    
    verifyApiRequest('successRegister', testUsers.newUser);
    verifyRedirect('/interventions');
  });

  it('Erreur inscription - Entreprise non reconnue', () => {
    mockRegisterResponse(400, {
      success: false,
      message: "Aucune entreprise n'a été reconnue"
    }, 'companyNotRecognized');

    fillRegisterForm(testUsers.newUserInvalidDomain);
    submitRegisterForm();
    
    verifyApiRequest('companyNotRecognized', testUsers.newUserInvalidDomain);
    verifyStayOnLoginPage();
    verifyErrorMessage("Aucune entreprise n'a été reconnue");
  });

  it('Erreur inscription - Email déjà utilisé', () => {
    mockRegisterResponse(400, {
      success: false,
      message: "Cet email est déjà utilisé"
    }, 'emailAlreadyExists');

    fillRegisterForm(testUsers.existingUser);
    submitRegisterForm();
    
    verifyApiRequest('emailAlreadyExists', testUsers.existingUser);
    verifyStayOnLoginPage();
    verifyErrorMessage("Cet email est déjà utilisé");
  });
});