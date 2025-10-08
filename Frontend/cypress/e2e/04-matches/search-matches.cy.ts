describe('Search Matches', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('searches and renders matches (should find results)', () => {
    cy.visit('/matches')
    cy.contains('Destino').parent().find('select').select('SEDE-1')
    cy.contains('button', 'Buscar Viajes').click()

    cy.contains('Encontrados', { timeout: 10000 }).should('be.visible')
  })
})


