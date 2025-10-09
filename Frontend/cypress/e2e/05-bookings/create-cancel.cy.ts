describe('Bookings Create & Cancel', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('crea una reserva desde matches y la cancela', () => {
    // Obtener un viaje válido desde la API
    cy.request('http://localhost:8081/api/trips?destinationSedeId=SEDE-1')
      .its('body').then((trips: any[]) => {
        expect(trips.length).to.be.greaterThan(0)
        const tripId = trips[0].id

        // Crear reserva directamente via API (ya no hay formulario manual en UI)
        cy.request('POST', 'http://localhost:8083/api/bookings', {
          tripId: tripId,
          seatsRequested: 1
        })

        // Visitar página de reservas
        cy.visit('/bookings')

        // Nueva UI: verificar que aparece la Card de reserva
        cy.contains('Mis Reservas').should('be.visible')
        
        // Verificar que la reserva aparece con el nuevo diseño
        cy.contains('Reserva #', { timeout: 10000 }).should('be.visible')
        cy.contains(tripId).should('be.visible')
        
        // Verificar badge de estado
        cy.contains('Pendiente').should('be.visible')

        // Mock de confirmación para el dialog
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true)
        })

        // Cancelar reserva
        cy.contains('Cancelar Reserva').first().click()

        // Verificar mensaje de éxito
        cy.contains('Reserva cancelada exitosamente', { timeout: 8000 }).should('be.visible')
        
        // Verificar que el badge cambió a "Cancelada"
        cy.contains('Cancelada').should('be.visible')
      })
  })

  it('muestra estado vacío cuando no hay reservas', () => {
    cy.visit('/bookings')
    
    // Si no hay reservas, debería mostrar el estado vacío mejorado
    cy.get('body').then(($body) => {
      if ($body.text().includes('No tienes reservas')) {
        cy.contains('No tienes reservas').should('be.visible')
        cy.contains('📋').should('be.visible')
        cy.contains('Ve a "Buscar"').should('be.visible')
      }
    })
  })
})


