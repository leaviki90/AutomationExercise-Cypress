describe("Miscellaneous Tests", () => {

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


    it("Verify the Contact Us form functionality", () => {
        const name = "Lea";
        const email = "someemail@gmail.com";
        const subject = "Some subject text";
        const message = "Some random message text";

        //Click on 'Contact Us' button
        cy.get("a[href='/contact_us']").click();

        //Verify 'GET IN TOUCH' is visible
        cy.get(".contact-form > .title").should("be.visible").and("have.text", "Get In Touch");

        //Enter name, email, subject and message
        cy.get("input[placeholder='Name']").type(name);
        cy.get("input[placeholder='Email']").type(email);
        cy.get("input[placeholder='Subject']").type(subject);
        cy.get("#message").type(message);

        //Upload file and verify the content
        cy.get("input[name='upload_file']").attachFile("cartoon-character.jpg")
            .then(input => {
                const fileName = input[0].value.split("\\").pop();
                expect(fileName).to.equal("cartoon-character.jpg");
            });

        //Click 'Submit' button
        cy.get("#contact-us-form").submit(); //here we test the form

        //Click OK button
        //Cypress automatically clicks on OK button, so there is no need for action

        //Verify success message 'Success! Your details have been submitted successfully.' is visible
        cy.get(".status.alert.alert-success").should("be.visible").and("have.text", "Success! Your details have been submitted successfully.");

        //Click 'Home' button and verify that landed to home page successfully
        cy.get(".btn.btn-success").click();
        cy.title().should('eq', 'Automation Exercise');
        cy.get("a").contains("Home").should('have.css', 'color', 'rgb(255, 165, 0)');
    })

})