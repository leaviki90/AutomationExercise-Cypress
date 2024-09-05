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


        //Verify 'ACCOUNT CREATED!' and click 'Continue' button
        cy.get("h2.title > b").should("contain", "Account Created!");
        cy.get("a[data-qa='continue-button']").click();

        //Verify ' Logged in as username' at top
        cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

        //Click 'Cart' button
        cy.clickOnCart();

        //Click 'Proceed To Checkout' button
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

        //Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        //Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        //Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        //Submit the form manually
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

        //Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        //Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        //Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        //Submit the form manually
        cy.get('form#payment-form').submit();

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();
    })

    it("Place order: login before checkout", () => {

        //Click 'Signup / Login' buttonž
        cy.loginSignupButtonClick();

        //Fill email, password and click 'Login' button
        cy.fixture('userDetails').then((user) => {
            cy.createUserProfile(user); // Use custom command to create profile via API
            cy.get("input[data-qa='login-email']").type(user.email);
            cy.get("input[placeholder='Password']").type(user.password);
            cy.get("button[data-qa='login-button']").click();

            //Verify 'Logged in as username' at top
            cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');
        });

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

        //Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        //Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        //Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        //Submit the form manually
        cy.get('form#payment-form').submit();

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();
    })

    it("Verify address details on the checkout page", () => {

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

        //Verify that the delivery address is same address filled at the time registration of account
        //Verify that the billing address is same address filled at the time registration of account
        cy.fixture('userDetails.json').then((data) => {
            cy.verifyAddress("#address_delivery", data);  //delivery address
            cy.verifyAddress("#address_invoice", data); //billing address
        });

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();
    })

    it.only("Download an invoice after placing an order", () => {

        //The file path for the downloaded invoice
        const filePath = 'cypress/downloads/invoice.txt';

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

        //Click 'Register / Login' button
        cy.registerLoginButton();

        //Fill all details in Signup and create account
        cy.registerNewUser(user);

        //Verify 'ACCOUNT CREATED!' and click 'Continue' button
        cy.get("h2.title > b").should("contain", "Account Created!");
        cy.get("a[data-qa='continue-button']").click();

        //Verify ' Logged in as username' at top
        cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

        //Click 'Cart' button
        cy.clickOnCart();

        //Click 'Proceed To Checkout' button
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

        //Prevent the default form submission behavior
        cy.get('form#payment-form').then(($form) => {
            $form.on('submit', (e) => {
                e.preventDefault(); // Stop the form from being submitted automatically
            });
        });

        //Click on the 'Pay and Confirm Order' button
        cy.get('#submit').click();

        //Verify the success message 'Your order has been placed successfully!' is visible
        cy.get('#success_message > .alert-success.alert')
            .should('be.visible') // Check that the success message is visible
            .and('contain', 'Your order has been placed successfully!'); // Ensure the message contains the correct text

        //Remove preventDefault and submit the form manually
        cy.get('form#payment-form').then(($form) => {
            // Remove the event that prevents form submission
            $form.off('submit'); // Disable preventDefault for this step
        });

        //Click on the submit button again to submit the form
        cy.get('#submit').click();

        //Click 'Download Invoice' button and verify invoice is downloaded successfully
        cy.get(".btn.btn-default.check_out").click();
        cy.readFile(filePath).should('exist');

        //Click 'Continue' button
        cy.get("a[data-qa = 'continue-button']").click();

        //Click 'Delete Account' button & Verify 'ACCOUNT DELETED!' and click 'Continue' button
        cy.deleteAccount();
        cy.get("a[data-qa = 'continue-button']").click();
    })
})




