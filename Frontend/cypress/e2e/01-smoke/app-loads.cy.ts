describe('Smoke Tests', () => {
  describe('Application Loads', () => {
    it('should load the home page', () => {
      cy.visit('/')
      cy.contains('bonÀreaGo').should('be.visible')
      cy.contains('Tu plataforma corporativa para compartir viajes').should('be.visible')
    })

    it('should display navigation menu', () => {
      cy.visit('/')
      cy.get('nav').should('be.visible')
      cy.contains('Inicio').should('be.visible')
      cy.contains('Iniciar Sesión').should('be.visible')
    })

    it('should display features section', () => {
      cy.visit('/')
      cy.contains('Comparte tu Viaje').should('be.visible')
      cy.contains('Encuentra Matches').should('be.visible')
      cy.contains('Ahorra Costos').should('be.visible')
    })

    it('should display how it works section', () => {
      cy.visit('/')
      cy.contains('¿Cómo funciona?').should('be.visible')
      cy.contains('Crea tu Viaje').should('be.visible')
      cy.contains('Busca Matches').should('be.visible')
      cy.contains('Reserva y Viaja').should('be.visible')
    })
  })

  describe('Infrastructure Health', () => {
    it('should have Keycloak available', () => {
      cy.request(`${Cypress.env('keycloakUrl')}/realms/${Cypress.env('keycloakRealm')}`)
        .its('status')
        .should('eq', 200)
    })

    it('should have all API microservices available', () => {
      // trips-service
      cy.request('http://localhost:8081/api/health')
        .its('status')
        .should('eq', 200)
      
      // users-service
      cy.request('http://localhost:8082/api/health')
        .its('status')
        .should('eq', 200)
      
      // booking-service
      cy.request('http://localhost:8083/api/health')
        .its('status')
        .should('eq', 200)
      
      // matching-service
      cy.request('http://localhost:8084/api/health')
        .its('status')
        .should('eq', 200)
    })
  })
})
