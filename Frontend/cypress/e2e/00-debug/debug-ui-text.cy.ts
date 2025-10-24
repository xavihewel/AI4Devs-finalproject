describe('Debug UI Text', () => {
  it('should show what text is actually on the page', () => {
    cy.visit('/')
    cy.wait(2000)
    
    // Get all text content and log it
    cy.get('body').then(($body) => {
      const text = $body.text()
      cy.log('=== FULL PAGE TEXT ===')
      cy.log(text)
      
      // Look for any button text
      cy.get('button').each(($button) => {
        const buttonText = $button.text().trim()
        if (buttonText) {
          cy.log(`Button found: "${buttonText}"`)
        }
      })
      
      // Look for any text that might be login related
      const loginKeywords = ['iniciar', 'sesión', 'login', 'comenzar', 'ahora', 'entrar', 'acceder']
      loginKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) {
          cy.log(`Found keyword "${keyword}" in page text`)
        }
      })
      
      // Write to file for inspection
      cy.writeFile('cypress/debug-output.txt', {
        fullText: text,
        buttons: [],
        foundKeywords: []
      }).then(() => {
        // Get button texts
        cy.get('button').then(($buttons) => {
          const buttonTexts = Array.from($buttons).map(btn => btn.textContent?.trim()).filter(Boolean)
          cy.writeFile('cypress/debug-output.txt', {
            fullText: text,
            buttons: buttonTexts,
            foundKeywords: loginKeywords.filter(keyword => text.toLowerCase().includes(keyword))
          })
        })
      })
    })
  })
})
