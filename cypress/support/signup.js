Cypress.Commands.add('signup', (username = 'user', password = 'password') => {
  cy
    .visit('/signup')
    .url().should('include', '/signup')
    .get('#username').type(username)
    .get('#password').type(password)
    .get('#BBQ').click()
    .get('form').submit()
    .url().should('include', '/dashboard')
});
