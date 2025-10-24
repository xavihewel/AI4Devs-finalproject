describe('Debug Select Options', () => {
  it('should show what options are available in selects', () => {
    cy.visit('/matches')
    cy.wait(2000)
    
    // Get all select elements and their options
    cy.get('select').each(($select, index) => {
      cy.log(`=== Select ${index + 1} ===`)
      cy.log(`ID: ${$select.attr('id')}`)
      cy.log(`Name: ${$select.attr('name')}`)
      cy.log(`Class: ${$select.attr('class')}`)
      
      // Get all options
      cy.get($select).find('option').each(($option) => {
        const value = $option.attr('value')
        const text = $option.text().trim()
        cy.log(`  Option: value="${value}" text="${text}"`)
      })
    })
    
    // Write to file for inspection
    cy.get('select').then(($selects) => {
      const selectData = Array.from($selects).map(($select, index) => {
        const options = Array.from($select.querySelectorAll('option')).map(option => ({
          value: option.getAttribute('value'),
          text: option.textContent?.trim()
        }))
        
        return {
          index: index + 1,
          id: $select.id,
          name: $select.getAttribute('name'),
          className: $select.className,
          options: options
        }
      })
      
      cy.writeFile('cypress/select-options-debug.txt', {
        page: 'matches',
        timestamp: new Date().toISOString(),
        selects: selectData
      })
    })
  })
})
