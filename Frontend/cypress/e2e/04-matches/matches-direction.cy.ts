describe('Matches Direction Filter', () => {
  it('sends direction param and corresponding sedeId', () => {
    cy.intercept('GET', '**/api/matches*').as('getMatches');

    cy.login();
    cy.visit('/matches');

    // Default TO_SEDE
    cy.get('select').contains('To sede');
    cy.findByLabelText('Destino').select('SEDE-1');
    cy.findAllByText('Buscar Viajes').eq(1).click();

    cy.wait('@getMatches').then(({ request }) => {
      expect(request.url).to.include('direction=TO_SEDE');
      expect(request.url).to.include('destinationSedeId=SEDE-1');
    });

    // Switch to FROM_SEDE
    cy.get('select').first().select('FROM_SEDE');
    cy.findByLabelText('Sede de Origen').select('SEDE-2');
    cy.findAllByText('Buscar Viajes').eq(1).click();

    cy.wait('@getMatches').then(({ request }) => {
      expect(request.url).to.include('direction=FROM_SEDE');
      expect(request.url).to.include('originSedeId=SEDE-2');
    });
  });
});


