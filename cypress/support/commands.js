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



// Command for creating a user profile via API
Cypress.Commands.add('createUserProfile', (user) => {
  cy.request({
      method: 'POST',
      url: 'https://automationexercise.com/api/createAccount',
      form: true,
      body: {
          name: user.firstName,
          email: user.email,
          password: user.password,
          title: "Mrs",
          birth_date: "30",
          birth_month: "December",
          birth_year: "1990",
          firstname: user.firstName,
          lastname: user.lastName,
          company: user.company,
          address1: user.address,
          address2: user.address2,
          country: "Australia",
          zipcode: user.zipcode,
          state: user.state,
          city: user.city,
          mobile_number: user.mobileNumber,
      }
  }).then((response) => {
      expect(response.status).to.eq(200);
  });
});


// Command for searching products and adding them to cart
Cypress.Commands.add('searchAndAddProductsToCart', (productName) => {
  // Enter product name in search input and click search button
  cy.get("#search_product").type(productName);
  cy.get("#search_product").should("have.value", productName);
  cy.get("#submit_search").click();

  // Verify 'SEARCHED PRODUCTS' is visible
  cy.get(".title.text-center").should("exist").and("be.visible").and("contain", "Searched Products");

  // Verify all the products related to search are visible and add them to the cart
  cy.get("body").then($body => {
      if ($body.find(".productinfo").length > 0) {
          cy.get(".productinfo").should("be.visible").each(($product) => {
              cy.wrap($product).within(() => {
                  cy.get("p").invoke("text").then((text) => {
                      const actualProductName = text.toLowerCase().trim();
                      const searchTerm = productName.toLowerCase().trim();
                      expect(actualProductName).to.include(searchTerm);
                  });
                  cy.get('.add-to-cart').click({ force: true });
              });
              cy.get('.modal-footer button').contains('Continue Shopping').click({ force: true });
          });
      } else {
          cy.log("No such product");
      }
  });
});

//add product to the cart
Cypress.Commands.add("addToCart", (productName) => {
  cy.contains(".productinfo", productName).find("a").click();
});


//click on "Continue Shopping" button
Cypress.Commands.add("clickOnContinueShopping", () => {
  cy.get("button.close-modal").click();
  })
/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />

//Click on "Cart" button
Cypress.Commands.add("clickOnCart", () => {
  cy.get("a[href='/view_cart']").first().click();
  })


//Verify that cart page is displayed
Cypress.Commands.add("verifyCartPage", () => {
  cy.url().should("include", "view_cart");
  cy.get(".btn.btn-default.check_out").should("be.visible");
})

//Click Proceed To Checkout
Cypress.Commands.add("proceedToCheckout", () => {
  cy.get(".btn.btn-default.check_out").click();
})

//Click 'Register / Login' button
Cypress.Commands.add("registerLoginButton", () => {
  cy.get(".modal-body a").click();
})



Cypress.Commands.add('registerNewUser', (user) => {
  cy.get(".signup-form h2").contains("New User Signup!"); // Assertion
  cy.xpath("//input[@placeholder='Name']").type(user.firstName);
  cy.xpath("//input[@data-qa='signup-email']").type(user.email);
  cy.xpath("//button[text()='Signup']").click();

  // Enter account information
  cy.xpath("//b[contains(text(), 'Enter Account Information')]").should("have.text", "Enter Account Information");

  // Visibility of radio buttons
  cy.get("#id_gender1").should("be.visible");
  cy.get("#id_gender2").should("be.visible");

  // Selecting radio buttons
  cy.get("#id_gender2").check().should("be.checked");
  cy.get("#id_gender1").should("not.be.checked");

  // Entering password and selecting date
  cy.get("#password").type(user.password);
  cy.get("#days").select("30");
  cy.get("#months").select("December");
  cy.get("#years").select("1990");

  // Visibility of the checkbox
  cy.get("#newsletter").should("be.visible");
  cy.get("#optin").should("be.visible");

  // Selecting all checkboxes at once
  cy.get("input[type='checkbox']").check().should("be.checked");

  cy.get("#first_name").type(user.firstName);
  cy.get("#last_name").type(user.lastName);
  cy.get("#company").type(user.company);
  cy.get("#address1").type(user.address);
  cy.get("#address2").type(user.address2);
  cy.get("#country").select("Australia").should("have.value", "Australia");
  cy.get("#state").type(user.state);
  cy.get("#city").type(user.city);
  cy.get("#zipcode").type(user.zipcode);
  cy.get("#mobile_number").type(user.mobileNumber);
  cy.get("button[data-qa='create-account']").click();
});

//Verify address - accepts id (for delivery, or for billing address)
Cypress.Commands.add("verifyAddress", (id, user) => {
  cy.get(id).within(() => {
    cy.contains('.address_firstname', `${user.firstName} ${user.lastName}`);
    cy.contains('.address_address1', `${user.address}`);
    cy.contains('.address_city', `${user.city} ${user.state} ${user.zipcode}`);
    cy.contains('.address_country_name', "Australia"); 
    cy.contains('.address_phone', `${user.mobileNumber}`);
  });
});


//Click on "Place Order"
Cypress.Commands.add("clickOnPlaceOrder", () => {
  cy.get("a.check_out").click();
})


//delete Account and verify the message 
Cypress.Commands.add("deleteAccount", () => {
  cy.get("a[href='/delete_account']").click();
  cy.get("h2.title > b").should("be.visible").and("contain", "Account Deleted!");
})


//Click on Signup / Login button
Cypress.Commands.add("loginSignupButtonClick", () => {
  cy.get("a[href='/login']").click();
})


//Click on view product button
Cypress.Commands.add("viewProduct", (productName) => {
  cy.contains(".product-image-wrapper", productName).find("a").last().click();
});