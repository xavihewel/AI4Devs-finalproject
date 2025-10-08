describe('Create Trip', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('creates a new trip and shows it in the list', () => {
    cy.visit('/trips')
    cy.contains('Crear Viaje').click()

    cy.get('input[placeholder="40.4168"]').clear().type('40.4168')
    cy.get('input[placeholder="-3.7038"]').clear().type('-3.7038')

    cy.contains('Destino').parent().find('select').select('SEDE-1')

    const dt = new Date(Date.now() + 60 * 60 * 1000)
    const local = dt.toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
    cy.get('input[type="datetime-local"]').type(local)

    cy.get('input[type="number"][min="1"]').clear().type('2')

    cy.contains('button', 'Crear Viaje').click()

    cy.contains('No tienes viajes creados').should('not.exist')
    cy.get('.grid').should('exist')
  })
})


