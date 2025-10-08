describe('Search Matches', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('searches and renders matches or empty state', () => {
    cy.visit('/matches')
    cy.contains('Destino').parent().find('select').select('SEDE-1')
    cy.contains('button', 'Buscar Viajes').click()

    cy.get('body').then(($b) => {
      if ($b.text().includes('No se encontraron viajes')) {
        cy.contains('No se encontraron viajes').should('be.visible')
      } else {
        cy.contains('Encontrados').should('be.visible')
      }
    })
  })
})


