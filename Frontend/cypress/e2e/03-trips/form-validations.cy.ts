describe('Trip Form Validations', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('should show error for latitude out of range', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Enter invalid latitude (95)
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('95')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('La latitud debe estar entre -90 y 90').should('be.visible')
    
    // Button should be disabled or form should not submit
    cy.get('form').should('exist')
  })

  it('should show error for longitude out of range', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Enter invalid longitude (-190)
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('41.3851')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('-190')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('La longitud debe estar entre -180 y 180').should('be.visible')
  })

  it('should show error for missing destination', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill all fields except destination
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('41.3851')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    // Don't select destination
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('El destino es obligatorio').should('be.visible')
  })

  it('should show error for past date', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill all fields with past date
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('41.3851')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set past date
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)
    pastDate.setHours(8, 30, 0, 0)
    const dateTimeString = pastDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('La fecha debe ser en el futuro').should('be.visible')
  })

  it('should show error for 0 seats', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill all fields with 0 seats
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('41.3851')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('0')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('Los asientos deben estar entre 1 y 8').should('be.visible')
  })

  it('should show error for too many seats (9)', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill all fields with 9 seats
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('41.3851')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('9')
    
    // Try to submit
    cy.contains('Crear').click()
    
    // Should show error message
    cy.contains('Los asientos deben estar entre 1 y 8').should('be.visible')
  })

  it('should disable submit button with validation errors', () => {
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill with invalid data
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('95') // Invalid lat
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    // Submit button should be disabled
    cy.get('button[type="submit"]').should('be.disabled')
    // Or if it's not disabled, clicking should not submit
    cy.contains('Crear').click()
    cy.get('form').should('exist') // Form should still be visible
  })

  it('should show localized error messages', () => {
    // Test in Spanish (default)
    cy.visit('/trips')
    cy.get('[data-testid="trips-page"]', { timeout: 15000 }).should('be.visible')
    
    cy.contains('Crear Viaje').click()
    
    // Fill with invalid data
    cy.get('input[type="number"][placeholder*="lat"]').clear().type('95')
    cy.get('input[type="number"][placeholder*="lng"]').clear().type('2.1734')
    cy.get('select').first().select('TO_SEDE')
    cy.get('select').eq(1).select('SEDE-1')
    
    // Set future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    futureDate.setHours(8, 30, 0, 0)
    const dateTimeString = futureDate.toISOString().slice(0, 16)
    cy.get('input[type="datetime-local"]').clear().type(dateTimeString)
    
    cy.get('input[type="number"][placeholder*="asientos"]').clear().type('4')
    
    cy.contains('Crear').click()
    
    // Should show Spanish error message
    cy.contains('La latitud debe estar entre -90 y 90').should('be.visible')
    
    // Switch to English
    cy.get('[data-testid="language-switcher"]').click()
    cy.contains('English').click()
    
    // Should show English error message
    cy.contains('Latitude must be between -90 and 90').should('be.visible')
  })
})