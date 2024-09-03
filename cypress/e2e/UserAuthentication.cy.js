
let user;
let userEmail;

beforeEach(() => {
  cy.visit('/'); //homepage url

     cy.clearCookies();
        cy.clearLocalStorage();

  // Validate homepage URL and page elements
  cy.url().should("include", "automationexercise");
  cy.title().should('eq', 'Automation Exercise');
  cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

  // Load user details from the fixture file before each test
  cy.fixture('userDetails').then((userData) => {
    user = userData;
    userEmail = `tester_${Date.now()}@test.com`; // Generating a dynamic email for each test
    user.email = userEmail; // Update the 'email' property of the 'user' object with the dynamically generated email
  });
});


afterEach(() => {
  cy.visit('/'); // Navigate to home page to ensure user is at a known state
  cy.get('body').then(($body) => {
    // Check if the user is logged in
    if ($body.find('a[href="/logout"]').length > 0) {
      cy.get('a[href="/logout"]').click(); // Logout if necessary
      
      //Check for the presence of the login link
      cy.get('a[href="/login"]').should('exist').and('be.visible'); // Ensure login link is visible after logout
    }
  });
});




describe('User Authentication Suite', function () {
  it('Register a new user', function () {

    // Go to the Signup page
    cy.get("a[href='/login']").first().click();
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
    
    //Entering password and selecting date
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

    // Validate account creation
    cy.get("h2.title > b").should("contain", "Account Created!");
    cy.get("a[data-qa='continue-button']").click();
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

    // Delete account
    cy.deleteAccount();
  });

  it('Login with correct email and password',() => {
  
    cy.fixture('userDetails').then((user) => {
      cy.createUserProfile(user); // Use custom command to create profile via API

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
  });

  it('Login with incorrect email', function () {
    
    // Go to the Login page
    cy.get("a[href='/login']").click();
    cy.get(".login-form > h2").should("contain", "Login to your account").and("be.visible");

    //Enter incorrect email and correct password
    cy.get("input[data-qa='login-email']").type("hellodarkness@myoldfriend");
    cy.get("input[placeholder='Password']").type(user.password);
    cy.get("button[data-qa='login-button']").click();

    //Validating error message
    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!').and('be.visible');

  });



  it('Login with incorrect password', function () {
    

    // Validate URL and page elements
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');
    cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

    // Go to the Login page
    cy.get("a[href='/login']").click();
    cy.get(".login-form > h2").should("contain", "Login to your account").and("be.visible");

    //Enter correct email and incorrect password
    cy.get("input[data-qa='login-email']").type(user.email);
    cy.get("input[placeholder='Password']").type("Hello World123");
    cy.get("button[data-qa='login-button']").click();
    //Validating error message
    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!').and('be.visible');

  });

  it('Logout user', function () {
    
    cy.fixture('userDetails').then((user) => {
      cy.createUserProfile(user); // Use custom command to create profile via API
   

    // Validate URL and page elements
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');
    cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

    // Go to the Login page
    cy.get("a[href='/login']").click();
    cy.get(".login-form > h2").should("contain", "Login to your account").and("be.visible");

    //Enter valid email and password
    cy.get("input[data-qa='login-email']").type(user.email);
    cy.get("input[placeholder='Password']").type(user.password);
    cy.get("button[data-qa='login-button']").click();

    // Validate successful login
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${user.firstName}')]`).should('be.visible');

    //Validate sussessful logout
    cy.get("a[href='/logout']").click();
    cy.get("a[href='/logout']").should("not.exist");
    cy.get("a[href='/login']").should("exist").and("be.visible");

    })

  });

  it('Register user with an existing email', function () {
    
    cy.fixture('userDetails').then((user) => {
      cy.createUserProfile(user); // Use custom command to create profile via API
   

    // Go to the Login page
    cy.get("a[href='/login']").click();
    cy.get(".signup-form h2").contains("New User Signup!"); // Assertion

    //Entering some random name with an already registered email
    cy.xpath("//input[@placeholder='Name']").type("Višnjičica");
    cy.xpath("//input[@data-qa='signup-email']").type(user.email);
    cy.xpath("//button[text()='Signup']").click();

    //Validating error message
    cy.get("input[value='signup']+p").should("contain", "Email Address already exist!").and("be.visible");
  });
})

  // Tests are independent; the order of execution does not matter.
});



