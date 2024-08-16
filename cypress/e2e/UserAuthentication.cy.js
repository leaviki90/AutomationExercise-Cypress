
const expectedURL = "https://www.automationexercise.com/";
let user;
let userEmail;

before(() => {
  //Generating a dynamic email only once before all tests
  userEmail = `tester_${Date.now()}@test.com`;
});



beforeEach(() => {
    // Load user details from the fixture file before each test
    cy.fixture('userDetails').then((userData) => {
        user = userData;// Assign the data loaded from the fixture to the 'user' variable
        user.email = userEmail; // Update the 'email' property of the 'user' object with the dynamically generated email
        
    });
});


describe('User Authentication Suite', function()  {
  it('Register a new user', function() {
    cy.visit(expectedURL);
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');

    // Go to the Signup page
    cy.get("a[href='/login']").click();
    cy.get(".signup-form h2").contains("New User Signup!"); //Assertion
    cy.xpath("//input[@placeholder='Name']").type(user.firstName);
    cy.xpath("//input[@data-qa='signup-email']").type(user.email);
    cy.xpath("//button[text()='Signup']").click();

    // Enter account information
    cy.xpath("//b[contains(text(), 'Enter Account Information')]").should("have.text", "Enter Account Information");
    cy.get("#id_gender2").check();
    cy.get("#password").type(user.password);
    cy.get("#days").select("30");
    cy.get("#months").select("December");
    cy.get("#years").select("1990");
    cy.get("#newsletter").check();
    cy.get("#optin").check();
    cy.get("#first_name").type(user.firstName);
    cy.get("#last_name").type(user.lastName);
    cy.get("#company").type(user.company);
    cy.get("#address1").type(user.address);
    cy.get("#address2").type(user.address2);
    cy.get("#country").select("Australia");
    cy.get("#state").type(user.state);
    cy.get("#city").type(user.city);
    cy.get("#zipcode").type(user.zipcode);
    cy.get("#mobile_number").type(user.mobileNumber);
    cy.get("button[data-qa='create-account']").click();

    // Validate account creation
    cy.get("h2.title > b").should("contain", "Account Created!");
    cy.get("a[data-qa='continue-button']").click();
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');
    
    // Logout
    cy.get("a[href='/logout']").click();
  })

  it('Login with correct email and password', function() {
    cy.visit(expectedURL);

    // Validate URL and page elements
    cy.url().should("eq", expectedURL); //implicit asertion
    cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");
    
    // Go to the Login page and login with valid credentials
    cy.get("a[href='/login']").click();
    cy.get(".login-form > h2").should("contain", "Login to your account").and("be.visible");
    cy.get("input[data-qa='login-email']").type(user.email);
    cy.get("input[placeholder='Password']").type(user.password);
    cy.get("button[data-qa='login-button']").click();

    // Validate successful login
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');
    
    // Delete account
    cy.get("a[href='/delete_account']").click();
    cy.get("h2.title > b").should("be.visible").and("contain", "Account Deleted!");
  })

  // These two test cases are logically connected. The order of execution should not be changed.


})



