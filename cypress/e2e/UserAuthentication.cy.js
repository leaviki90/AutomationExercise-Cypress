const url = "https://www.automationexercise.com/";
let user;
let userEmail;

beforeEach(() => {
  // Load user details from the fixture file before each test
  cy.fixture('userDetails').then((userData) => {
    user = userData;
    userEmail = `tester_${Date.now()}@test.com`; // Generating a dynamic email for each test
    user.email = userEmail; // Update the 'email' property of the 'user' object with the dynamically generated email
  });
});

describe('User Authentication Suite', function () {
  it('Register a new user', function () {
    cy.visit(url);
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');

    // Go to the Signup page
    cy.get("a[href='/login']").click();
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
    //cy.get("a[href='/logout']").click();

    // Delete account
    cy.get("a[href='/delete_account']").click();
    cy.get("h2.title > b").should("be.visible").and("contain", "Account Deleted!");
  });

  it('Login with correct email and password', function () {
    cy.visit(url);

    // API call to create a new user with valid data
    cy.request({
      method: 'POST',
      url: 'https://automationexercise.com/api/createAccount',
      form: true, // Enables x-www-form-urlencoded encoding
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
      // Validate the response
      expect(response.status).to.eq(200);
    });

    // Validate URL and page elements
    cy.url().should("eq", url); // Implicit assertion
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
  });

  it('Login with incorrect email', function () {
    cy.visit(url);

    // Validate URL and page elements
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');
    cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

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
    cy.visit(url);

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
    cy.visit(url);

     // API call to create a new user with valid data
     cy.request({
      method: 'POST',
      url: 'https://automationexercise.com/api/createAccount',
      form: true, // Enables x-www-form-urlencoded encoding
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
      // Validate the response
      expect(response.status).to.eq(200);
    });

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

  });

  it.only('Register user with an existing email', function () {
    cy.visit(url);

     // API call to create a new user with valid data
     cy.request({
      method: 'POST',
      url: 'https://automationexercise.com/api/createAccount',
      form: true, // Enables x-www-form-urlencoded encoding
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
      // Validate the response
      expect(response.status).to.eq(200);
    });

    // Validate URL and page elements
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');
    cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

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

  // Tests are independent; the order of execution does not matter.
});


