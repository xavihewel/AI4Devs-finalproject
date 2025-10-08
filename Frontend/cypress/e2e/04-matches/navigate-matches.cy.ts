describe('Matches Navigation', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('should navigate to matches page from home', () => {
    cy.visit('/')
    cy.contains('Buscar Viajes').click()
    cy.url().should('include', '/matches')
    cy.contains('Buscar Viajes').should('be.visible')
  })

  it('should navigate to matches page from navbar', () => {
    cy.visit('/')
    cy.get('nav').contains('Buscar').click()
    cy.url().should('include', '/matches')
    cy.contains('Buscar Viajes').should('be.visible')
  })

  it('should display matches page elements', () => {
    cy.visit('/matches')
    
    // Should have page title
    cy.contains('Buscar Viajes').should('be.visible')
    
    // Should have search form
    cy.get('form').should('exist')
    
    // Should have destination select
    cy.contains('Destino').should('be.visible')
  })
})
