describe('Create Booking', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('creates a booking for an existing trip', () => {
    cy.visit('/bookings')
    // Use a known seeded trip id from inserts
    const tripId = '550e8400-e29b-41d4-a716-446655440201'
    cy.get('input[aria-label="Trip ID"]').clear().type(tripId)
    cy.get('input[aria-label="Seats"]').clear().type('1')
    cy.contains('button', 'Crear reserva').click()

    // Should render either updated list or at least no error
    cy.get('div[role="alert"]').should('not.exist')
  })
})



