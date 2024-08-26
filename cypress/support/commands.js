// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js

// cypress/support/commands.js

// Custom command to get the iFrame's body, accepts an iframe selector as parameter
Cypress.Commands.add('getIframeBody', (selector) => {
    // Get the iframe element
    cy.get(selector).then($iframe => {
        // Access the body element within the iframe
        const body = $iframe.contents().find('body');
        
        // Ensure the body is visible before proceeding
        cy.wrap(body).should('be.visible');
        
        return cy.wrap(body);
    });
});

//custom command for clicking on link using label

Cypress.Commands.add("clickLink", (label) => {
    cy.get("a").contains(label).click();
})


//custom command for overwriting contains() method's case sensitivity
Cypress.Commands.overwriteQuery(
    "contains",
    function (contains, filter, text, userOptions = {}) {
  
      // This is parameter resolution from Cypress v12.7.0 source
      if (Cypress._.isRegExp(text)) {
        // .contains(filter, text)
        // Do nothing
      } else if (Cypress._.isObject(text)) {
        // .contains(text, userOptions)
        userOptions = text
        text = filter
        filter = ''
      } else if (Cypress._.isUndefined(text)) {
        // .contains(text)
        text = filter
        filter = ''
      }
  
      userOptions.matchCase = false;
  
      let contains0 = contains.bind(this)    // this line fixes the error
  
      return contains0(filter, text, userOptions)
    }
  )



//custom command for login
// Cypress.Commands.add("loginApp", (email, password) => {
//     cy.get("input[data-qa='login-email']").type(email);
//     cy.get("input[placeholder='Password']").type(password);
//     cy.get("button[data-qa='login-button']").click();
// })

/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />