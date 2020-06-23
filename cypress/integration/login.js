describe('Login', () => {
  const unique = 'uniqueUser';

  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  before(() => {
    cy
      .signup(unique, 'password')
      .get('[data-test=logout]').should('have.text', 'Logout').click();
  });

  it('should display an eerror message for an incorrect password', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type(unique)
      .get('#password').type('wrong')
      .get('form').submit()
      .get('.alert')
      .should('be.visible')
      .should('have.text', 'Incorrect password.');
  });

  it('should display an eerror message for a user who does not exist', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type('doesnoteexist')
      .get('#password').type('doesnoteexist')
      .get('form').submit()
      .get('.alert')
      .should('be.visible')
      .should('have.text', 'User could not be found.');
  });

  it('should log in user who already exists and redirect to dashboard', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type(unique)
      .get('#password').type('password')
      .get('form').submit()
      .url().should('include', '/dashboard');
  });
});
