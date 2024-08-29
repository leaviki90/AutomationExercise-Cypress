describe("Checkout Process", () => {
   
    let user;
    let userEmail;
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");
        //Verify that home page is visible successfully
        cy.url().should("include", "automationexercise");
        cy.title().should('eq', 'Automation Exercise');
        cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

        cy.fixture('userDetails.json').then((data) => { //getting user data
            user = data;
            userEmail = `tester_${Date.now()}@test.com`; // Generating a dynamic email for each test
    user.email = userEmail; // Update the 'email' property of the 'user' object with the dynamically generated email
    });
        });
        
    


    it.only("Place an order while registering during checkout", () => {
     

      cy.addToCart("Blue Top");  //Add product to cart
      cy.clickOnContinueShopping();  //Close modal by clicking on Continue Shopping
      cy.addToCart("Men Tshirt");
      cy.clickOnContinueShopping();
      cy.addToCart("Sleeveless Dress");
      cy.clickOnContinueShopping();

      //We added three products to cart, by choice

      //Click on "Cart" button
      cy.clickOnCart();

      //Verify that cart page is displayed
      cy.verifyCartPage();

      //Click Proceed To Checkout
      cy.proceedToCheckout();

      //Click 'Register / Login' button
      cy.registerLoginButton();

      //Fill all details in Signup and create account
      cy.registerNewUser(user);
      

    // Validate account creation
    cy.get("h2.title > b").should("contain", "Account Created!");
    cy.get("a[data-qa='continue-button']").click();
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');
    

      
     
    })
})