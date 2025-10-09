describe('Profile Edit', () => {
  beforeEach(() => {
    cy.loginViaKeycloak('test.user', 'password123')
  })

  it('edita y guarda el perfil', () => {
    cy.visit('/me')
    cy.contains('Mi Perfil').should('be.visible')

    cy.contains('Nombre').parent().find('input').clear().type('Usuario Test E2E')
    cy.contains('Email').parent().find('input').clear().type('test.user@company.com')
    cy.contains('Sede').parent().find('input').clear().type('SEDE-1')

    cy.contains('button', 'Guardar cambios').should('not.be.disabled').click()
    cy.contains('Cambios guardados', { timeout: 8000 }).should('be.visible')
  })
})
