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




    it("Place order: register while checkout", () => {

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


        // Verify 'ACCOUNT CREATED!' and click 'Continue' button
        cy.get("h2.title > b").should("contain", "Account Created!");
        cy.get("a[data-qa='continue-button']").click();

        //Verify ' Logged in as username' at top
        cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

        //Click 'Cart' button
        cy.clickOnCart();

        //Click 'Proceed To Checkout' button
        cy.proceedToCheckout();

        //Verify Address Details and Review Your Order

        // Ensure that verifyAddress is executed after user data is available
        cy.fixture('userDetails.json').then((data) => {
            cy.verifyAddress("#address_delivery", data);  //delivery address
            cy.verifyAddress("#address_invoice", data); //billing address
        });

        // Verify Product Names
        cy.get('tbody').contains('Blue Top').should('be.visible');
        cy.get('tbody').contains('Men Tshirt').should('be.visible');
        cy.get('tbody').contains('Sleeveless Dress').should('be.visible');

        //Enter description in comment text area and click 'Place Order'
        cy.get("textarea[name='message']").type("Some comment");
        cy.clickOnPlaceOrder();


        //Enter payment details: Name on Card, Card Number, CVC, Expiration date
        cy.get("input[name='name_on_card']").type("Zmaj");
        cy.get("input[name='card_number']").type("456789");
        cy.get("input[placeholder='ex. 311']").type("123");
        cy.get("input[placeholder='MM']").type("December");
        cy.get("input[placeholder='YYYY']").type("2050");

        // Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        // Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        // Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        // Submit the form manually
        cy.get('form#payment-form').submit();

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();

    })

    it("Place order: register before checkout", () => {

        //Click 'Signup / Login' button
        cy.loginSignupButtonClick();

        //Fill all details in Signup and create account
        cy.registerNewUser(user);

        //Verify 'ACCOUNT CREATED!' and click 'Continue' button
        cy.get("h2.title > b").should("contain", "Account Created!");
        cy.get("a[data-qa='continue-button']").click();

        //Verify ' Logged in as username' at top
        cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

        //Add products to Cart
        cy.addToCart("Blue Top");  //Add product to cart
        cy.clickOnContinueShopping();  //Close modal by clicking on Continue Shopping
        cy.addToCart("Men Tshirt");
        cy.clickOnContinueShopping();
        cy.addToCart("Sleeveless Dress");
        cy.clickOnContinueShopping();

        //Click on "Cart" button
        cy.clickOnCart();

        //Verify that cart page is displayed
        cy.verifyCartPage();

        //Click Proceed To Checkout
        cy.proceedToCheckout();

        //Verify Address Details and Review Your Order

        //Ensure that verifyAddress is executed after user data is available
        cy.fixture('userDetails.json').then((data) => {
            cy.verifyAddress("#address_delivery", data);  //delivery address
            cy.verifyAddress("#address_invoice", data); //billing address
        });

        //Verify Product Names
        cy.get('tbody').contains('Blue Top').should('be.visible');
        cy.get('tbody').contains('Men Tshirt').should('be.visible');
        cy.get('tbody').contains('Sleeveless Dress').should('be.visible');

        //Enter description in comment text area and click 'Place Order'
        cy.get("textarea[name='message']").type("Some comment");
        cy.clickOnPlaceOrder();


        //Enter payment details: Name on Card, Card Number, CVC, Expiration date
        cy.get("input[name='name_on_card']").type("Zmaj");
        cy.get("input[name='card_number']").type("456789");
        cy.get("input[placeholder='ex. 311']").type("123");
        cy.get("input[placeholder='MM']").type("December");
        cy.get("input[placeholder='YYYY']").type("2050");

        // Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        // Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        // Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        // Submit the form manually
        cy.get('form#payment-form').submit();

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();
    })
})