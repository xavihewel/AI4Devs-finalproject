describe('Trip Form Validations', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
    cy.visit('/trips')
    cy.contains('button', 'Crear Viaje').click()
  })

  it('should show asterisks on all required fields', () => {
    // Verificar que todos los campos obligatorios tienen asterisco
    cy.contains('Latitud de Origen *').should('be.visible')
    cy.contains('Longitud de Origen *').should('be.visible')
    cy.contains('Destino *').should('be.visible')
    cy.contains('Fecha y Hora *').should('be.visible')
    cy.contains('Asientos Totales *').should('be.visible')
  })

  it('should validate latitude range', () => {
    // Ingresar latitud fuera de rango
    cy.get('input[placeholder="40.4168"]').clear().type('95')
    cy.get('input[placeholder="40.4168"]').blur()

    // Verificar mensaje de error
    cy.contains('debe estar entre -90 y 90').should('be.visible')
  })

  it('should validate longitude range', () => {
    // Ingresar longitud fuera de rango
    cy.get('input[placeholder="-3.7038"]').clear().type('200')
    cy.get('input[placeholder="-3.7038"]').blur()

    // Verificar mensaje de error
    cy.contains('debe estar entre -180 y 180').should('be.visible')
  })

  it('should prevent submit with empty required fields', () => {
    // Intentar enviar sin llenar campos
    cy.contains('button', 'Crear Viaje').click()

    // Verificar mensaje de error general (con timeout más largo)
    cy.contains('corrige los errores', { timeout: 8000 }).should('be.visible')

    // Verificar que no se creó el viaje (seguimos en el formulario)
    cy.contains('Crear Nuevo Viaje').should('be.visible')
  })

  it('should validate that destination is selected', () => {
    // Llenar otros campos pero dejar destino vacío
    cy.get('input[placeholder="40.4168"]').type('40.4168')
    cy.get('input[placeholder="-3.7038"]').type('-3.7038')

    const dt = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').type(dt)
    cy.get('input[type="number"][min="1"]').type('2')

    // Dejar destino en "Selecciona un destino" (primera opción vacía)
    cy.get('select').should('have.value', '')

    // Intentar enviar
    cy.contains('button', 'Crear Viaje').click()

    // El mensaje general aparece porque hay un error
    cy.contains('corrige los errores', { timeout: 8000 }).should('be.visible')
  })

  it('should validate future dates only', () => {
    // Llenar campos válidos
    cy.get('input[placeholder="40.4168"]').type('40.4168')
    cy.get('input[placeholder="-3.7038"]').type('-3.7038')
    cy.get('select').select('SEDE-1')
    
    // Intentar poner fecha pasada (nota: datetime-local no permite fechas muy antiguas)
    // Usar una fecha de ayer
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const pastDate = yesterday.toISOString().slice(0, 16)
    
    cy.get('input[type="datetime-local"]').type(pastDate)
    cy.get('input[type="number"][min="1"]').type('2')

    cy.contains('button', 'Crear Viaje').click()

    // Verificar mensaje de error (con timeout más largo)
    cy.contains('debe ser en el futuro', { timeout: 8000 }).should('be.visible')
  })

  it('should validate seats range (1-8)', () => {
    // Llenar campos básicos
    cy.get('input[placeholder="40.4168"]').type('40.4168')
    cy.get('input[placeholder="-3.7038"]').type('-3.7038')
    cy.get('select').select('SEDE-1')
    
    const dt = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').type(dt)

    // Intentar más de 8 asientos
    cy.get('input[type="number"][min="1"]').clear().type('10')
    cy.get('input[type="number"][min="1"]').blur()

    // Verificar mensaje de error
    cy.contains('No pueden ser más de 8 asientos').should('be.visible')
  })

  it('should show helper text for seats', () => {
    // Verificar que hay helper text
    cy.contains('Máximo 8 asientos').should('be.visible')
  })

  it('should create trip when all fields are valid', () => {
    // Llenar todos los campos correctamente
    cy.get('input[placeholder="40.4168"]').type('40.4168')
    cy.get('input[placeholder="-3.7038"]').type('-3.7038')
    cy.get('select').select('SEDE-1')
    
    const dt = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').type(dt)
    cy.get('input[type="number"][min="1"]').type('3')

    // Enviar formulario
    cy.contains('button', 'Crear Viaje').click()

    // Verificar mensaje de éxito (con timeout más largo y búsqueda más flexible)
    cy.contains(/viaje creado/i, { timeout: 10000 }).should('be.visible')

    // Verificar que el formulario se cierra
    cy.contains('Crear Nuevo Viaje', { timeout: 5000 }).should('not.exist')

    // Verificar que el viaje aparece en la lista
    cy.contains('Viaje a SEDE-1', { timeout: 10000 }).should('be.visible')
  })
})

