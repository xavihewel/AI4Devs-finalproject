describe('Trips Edit & Delete', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('crea, edita y elimina un viaje', () => {
    // Precondición: trips-service disponible
    cy.request('http://localhost:8081/api/trips')
    cy.visit('/trips')
    cy.contains('Crear Viaje').click()

    cy.get('input[placeholder="40.4168"]').clear().type('40.4168')
    cy.get('input[placeholder="-3.7038"]').clear().type('-3.7038')
    cy.contains('Destino').parent().find('select').select('SEDE-1')
    const dt = new Date(Date.now() + 90 * 60 * 1000).toISOString().slice(0,16)
    cy.get('input[type="datetime-local"]').type(dt)
    cy.get('input[type="number"][min="1"]').clear().type('2')
    cy.contains('button', 'Crear Viaje').click()

    cy.contains('Viaje a SEDE-1', { timeout: 8000 }).should('be.visible')

    cy.get('[data-cy^="edit-trip-"]').first().click()
    cy.contains('Viaje a SEDE-1').should('exist')

    cy.get('[data-cy^="delete-trip-"]').first().click()
    cy.get('body').should('not.contain', 'Error')
  })
})


