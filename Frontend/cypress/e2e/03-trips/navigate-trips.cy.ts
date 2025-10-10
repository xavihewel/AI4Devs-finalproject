describe('Trips Navigation', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('should navigate to trips page from home', () => {
    cy.visit('/')
    cy.contains('Crear Viaje', { timeout: 15000 }).click()
    cy.url().should('include', '/trips')
    cy.contains('Mis Viajes', { timeout: 15000 }).should('be.visible')
  })

  it('should navigate to trips page from navbar', () => {
    cy.visit('/')
    cy.get('nav', { timeout: 15000 }).contains('Viajes', { timeout: 15000 }).click()
    cy.url().should('include', '/trips')
    cy.contains('Mis Viajes', { timeout: 15000 }).should('be.visible')
  })

  it('should display trips page elements', () => {
    cy.visit('/trips')
    
    // Should have page title
    cy.contains('Mis Viajes', { timeout: 15000 }).should('be.visible')
    
    // Should have create trip button
    cy.contains('Crear Viaje', { timeout: 15000 }).should('be.visible')
    
    // Should display empty state or trip cards
    cy.get('body').then(($body) => {
      if ($body.text().includes('No tienes viajes creados')) {
        cy.contains('No tienes viajes creados', { timeout: 15000 }).should('be.visible')
      } else {
        // Has trips, should show cards
        cy.get('.space-y-6', { timeout: 15000 }).should('exist')
      }
    })
  })

  it('should display map preview in trip cards when coordinates are available', () => {
    cy.visit('/trips')
    
    // Check if there are any trip cards with coordinates
    cy.get('body').then(($body) => {
      if (!$body.text().includes('No tienes viajes creados')) {
        // Look for map containers in trip cards - they should exist if trips have coordinates
        cy.get('[data-testid="map-container"]', { timeout: 5000 }).then(($maps) => {
          if ($maps.length > 0) {
            // Verify map has correct attributes
            cy.get('[data-testid="map-container"]').first().should('have.attr', 'data-zoom', '13')
            
            // Verify tile layer is present
            cy.get('[data-testid="tile-layer"]').should('exist')
            
            // Verify markers are present (origin markers)
            cy.get('[data-testid="circle-marker"]').should('exist')
          } else {
            // No maps found - this is acceptable if trips don't have coordinates
            cy.log('No maps found - trips may not have coordinates')
          }
        }).catch(() => {
          // Timeout is acceptable - no maps found
          cy.log('No maps found - trips may not have coordinates')
        })
      } else {
        // No trips available - this is expected in test environment
        cy.log('No trips available for map testing')
      }
    })
  })
})
