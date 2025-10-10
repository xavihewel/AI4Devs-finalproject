describe('Create Trip', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('creates a new trip and shows it in the list', () => {
    // Crear viaje vía API para estabilidad en bypass
    const futureIso = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    cy.request('POST', 'http://localhost:8081/api/trips', {
      origin: { lat: 40.4168, lng: -3.7038 },
      destinationSedeId: 'SEDE-1',
      dateTime: futureIso,
      seatsTotal: 2,
    }).its('status').should('eq', 200)

    // Verificar en UI
    cy.visit('/trips')
    cy.contains('Mis Viajes', { timeout: 15000 }).should('be.visible')
    cy.contains('Viaje a SEDE-1', { timeout: 15000 }).should('be.visible')
  })
})


