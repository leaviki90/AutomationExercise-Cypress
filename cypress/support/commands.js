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




/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />