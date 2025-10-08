describe('Bookings List', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('loads bookings page without errors', () => {
    cy.visit('/bookings')
    cy.contains('Mis reservas').should('be.visible')
    cy.get('body').then(($b) => {
      if ($b.text().includes('No tienes reservas.')) {
        cy.contains('No tienes reservas.').should('be.visible')
      } else {
        cy.get('ul').should('exist')
      }
    })
  })
})


