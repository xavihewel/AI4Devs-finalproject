/// <reference types="cypress" />

// ***********************************************
// Custom commands for bonÀreaGo E2E tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via Keycloak
       * @example cy.loginViaKeycloak('test.user', 'password123')
       */
      loginViaKeycloak(username: string, password: string): Chainable<void>
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>
      
      /**
       * Custom command to get element by data-cy attribute
       * @example cy.getByCy('submit-button')
       */
      getByCy(selector: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

/**
 * Login via Keycloak using cy.session for performance
 * This caches the authentication state
 */
Cypress.Commands.add('loginViaKeycloak', (username: string, password: string) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/')
      
      // Click login button
      cy.contains('Iniciar Sesión', { timeout: 10000 }).click()
      
      // Handle Keycloak login page
      cy.origin(
        Cypress.env('keycloakUrl'),
        { args: { username, password } },
        ({ username, password }) => {
          // Wait for Keycloak login form
          cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
          cy.get('input[name="username"]').clear().type(username)
          cy.get('input[name="password"]').clear().type(password)
          cy.get('input[type="submit"]').click()
        }
      )
      
      // Verify we're back in the app and authenticated
      cy.url({ timeout: 15000 }).should('not.include', Cypress.env('keycloakUrl'))
      cy.url().should('include', Cypress.config('baseUrl'))
      
      // Wait for authentication to complete
      cy.contains('Crear Viaje', { timeout: 10000 }).should('be.visible')
    },
    {
      validate() {
        // Validate session is still valid
        cy.visit('/')
        cy.contains('Crear Viaje', { timeout: 5000 }).should('be.visible')
      },
    }
  )
  
  // After session is restored, visit home
  cy.visit('/')
})

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  cy.contains('Cerrar Sesión').click()
  cy.contains('Iniciar Sesión', { timeout: 5000 }).should('be.visible')
})

/**
 * Get element by data-cy attribute
 */
Cypress.Commands.add('getByCy', (selector: string) => {
  return cy.get(`[data-cy="${selector}"]`)
})

// Prevent TypeScript errors
export {}
