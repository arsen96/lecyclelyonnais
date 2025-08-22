// Types utilisateurs pour tests
interface LoginUser {
    email: string;
    password: string;
  }
  
  interface RegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }

  // Données utilisateurs pour tests
  export const testUsers = {
    validClient: {
      email: 'client.test@test.com',
      password: 'password123'
    },
    validAdmin: {
      email: 'admin.test@test.com',
      password: 'admin123'
    },
    validTechnician: {
      email: 'tech.test@test.com',
      password: 'tech123'
    },
    invalidUser: {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    },
    newUser: {
      firstName: 'Nouveau',
      lastName: 'Client',
      email: 'nouveau@test.com',
      password: 'password123',
      phone: '0123456789',
      address: '123 Rue Test, Paris'
    },
    existingUser: {
      firstName: 'Utilisateur',
      lastName: 'Existant',
      email: 'client.test@test.com',
      password: 'password123',
      phone: '0123456789',
      address: '123 Rue Test, Paris'
    },
    newUserInvalidDomain: {
      firstName: 'Nouveau',
      lastName: 'Client',
      email: 'nouveau@test.com',
      password: 'password123',
      phone: '0123456789',
      address: '123 Rue Test, Paris'
    }
  };
  
  // Remplir formulaire connexion
  export const fillLoginForm = (user: LoginUser) => {
    cy.get('.emailLogin').type(user.email);
    cy.get('.passwordLogin').type(user.password);
  };
  
  // Remplir formulaire inscription
  export const fillRegisterForm = (user: RegisterUser) => {
    cy.get('.firstNameRegister').type(user.firstName);
    cy.get('.lastNameRegister').type(user.lastName);
    cy.get('.emailRegister').type(user.email);
    cy.get('.passwordRegister').type(user.password);
    cy.get('.phoneRegister').type(user.phone);
    cy.get('.address_write').first().type(user.address);
  };
  
  // Envoyer formulaire connexion
  export const submitLoginForm = () => {
    cy.get('.loginButton').click();
  };
  
  // Envoyer formulaire inscription
  export const submitRegisterForm = () => {
    cy.get('.registerButton').click();
  };
  
  // Simuler réponse API connexion
  export const mockLoginResponse = (statusCode: number, responseBody: any, alias: string) => {
    cy.intercept('POST', '**/auth/login', {
      statusCode,
      body: responseBody
    }).as(alias);
  };
  
  // Simuler réponse API inscription
  export const mockRegisterResponse = (statusCode: number, responseBody: any, alias: string) => {
    cy.intercept('POST', '**/auth/register', {
      statusCode,
      body: responseBody
    }).as(alias);
  };
  
  // Vérifier requête API
  export const verifyApiRequest = (alias: string, expectedBody: any) => {
    cy.wait(`@${alias}`).then((interception) => {
      expect(interception.request.body).to.deep.include(expectedBody);
    });
  };
  
  // Vérifier message erreur
  export const verifyErrorMessage = (message: string) => {
    cy.contains(message).should('be.visible');
  };
  
  // Vérifier redirection
  export const verifyRedirect = (expectedUrl: string) => {
    cy.url().should('include', expectedUrl);
  };
  
  // Vérifier reste sur page connexion
  export const verifyStayOnLoginPage = () => {
    cy.url().should('include', '/login');
  };
  
  // Vérifier état bouton connexion
  export const verifyLoginButtonState = (shouldBeDisabled: boolean) => {
    if (shouldBeDisabled) {
      cy.get('.loginButton').should('have.class', 'button-disabled');
    } else {
      cy.get('.loginButton').should('not.have.class', 'button-disabled');
    }
  };