describe('Bookings Create & Cancel', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('crea y cancela una reserva', () => {
    // Obtener un viaje válido desde la API
    cy.request('http://localhost:8081/api/trips?destinationSedeId=SEDE-1')
      .its('body').then((trips: any[]) => {
        expect(trips.length).to.be.greaterThan(0)
        const tripId = trips[0].id

        // asegurar que booking-service responde
        cy.request('http://localhost:8083/api/health')
        cy.visit('/bookings')
        cy.get('input[aria-label="Trip ID"]').clear().type(tripId)
        cy.get('input[aria-label="Seats"]').clear().type('1')
        cy.contains('button', 'Crear reserva').click()

        // puede tardar en renderizar: espera a que aparezca la lista o estado vacío
        cy.get('body').then(($b) => {
          if ($b.text().includes('No tienes reservas.')) {
            // tras crear, debería desaparecer el vacío y aparecer la lista
            cy.contains('No tienes reservas.').should('not.exist')
          }
        })
        cy.get('ul', { timeout: 10000 }).should('exist')
        cy.get('ul').contains(tripId).should('be.visible')

        // Cancela si hay botón disponible
        cy.get('ul li').contains(tripId).parent().within(() => {
          cy.contains('Cancelar').click({ force: true })
        })
        cy.get('ul li').contains(tripId).should('contain.text', 'CANCELLED')
      })
  })
})


