describe('Trips Navigation', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('should navigate to trips page from home', () => {
    cy.visit('/')
    cy.contains('Crear Viaje').click()
    cy.url().should('include', '/trips')
    cy.contains('Mis Viajes').should('be.visible')
  })

  it('should navigate to trips page from navbar', () => {
    cy.visit('/')
    cy.get('nav').contains('Viajes').click()
    cy.url().should('include', '/trips')
    cy.contains('Mis Viajes').should('be.visible')
  })

  it('should display trips page elements', () => {
    cy.visit('/trips')
    
    // Should have page title
    cy.contains('Mis Viajes').should('be.visible')
    
    // Should have create trip button
    cy.contains('Crear Viaje').should('be.visible')
    
    // Should display empty state or trip cards
    cy.get('body').then(($body) => {
      if ($body.text().includes('No tienes viajes creados')) {
        cy.contains('No tienes viajes creados').should('be.visible')
      } else {
        // Has trips, should show cards
        cy.get('.space-y-6').should('exist')
      }
    })
  })
})
