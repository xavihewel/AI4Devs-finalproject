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

    // Botón ahora dice "+1 Asiento" en lugar de "Editar"
    cy.contains('button', '+1 Asiento').first().click()
    
    // Verificar mensaje de éxito
    cy.contains('Asientos actualizados', { timeout: 8000 }).should('be.visible')

    // Eliminar viaje (ahora pide confirmación)
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('[data-cy^="delete-trip-"]').first().click()
    
    // Verificar mensaje de éxito
    cy.contains('Viaje cancelado exitosamente', { timeout: 8000 }).should('be.visible')
  })
})


