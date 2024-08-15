const email = `tester_${Date.now()}@test.com`; //with the timestamp
const password = "12345678";
const firstName = "Lea";
const lastName = "Lastname";
const company = "Somecompany";
const address = "Kržince bb";
const address2 = "Kržince bb"; 
const country = "Serbia"; 
const state = "Serbia";
const city = "Niš bato"; 
const zipcode = "18000";
const mobileNumber = "0631234567";


describe('User Authentication Suite', () => {
  it('Register User', () => {
    cy.visit('https://www.automationexercise.com/');
    cy.url().should("include", "automationexercise");
    cy.title().should('eq', 'Automation Exercise');
    cy.get("a[href='/login']").click();
    cy.get(".signup-form h2").contains("New User Signup!"); //Assertion
    cy.xpath("//input[@placeholder='Name']").type(firstName);
    cy.xpath("//input[@data-qa='signup-email']").type(email);
    cy.xpath("//button[text()='Signup']").click();
    cy.xpath("//b[contains(text(), 'Enter Account Information')]").should("have.text", "Enter Account Information");
    cy.get("#id_gender2").check();
    //cy.get("#name").type(firstName);
    //cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#days").select("30");
    cy.get("#months").select("December");
    cy.get("#years").select("1990");
    cy.get("#newsletter").check();
    cy.get("#optin").check();
    cy.get("#first_name").type(firstName);
    cy.get("#last_name").type(lastName);
    cy.get("#company").type(company);
    cy.get("#address1").type(address);
    cy.get("#address2").type(address2);
    cy.get("#country").select("Australia");
    cy.get("#state").type(state);
    cy.get("#city").type(city);
    cy.get("#zipcode").type(zipcode);
    cy.get("#mobile_number").type(mobileNumber);
    cy.get("button[data-qa='create-account']").click();
    cy.get("h2.title > b").should("contain", "Account Created!");
    cy.get("a[data-qa='continue-button']").click();
    cy.xpath(`//a[contains(text(), ' Logged in as ')]/b[contains(text(), '${firstName}')]`).should('be.visible');
    cy.get("a[href='/delete_account']").click();
    cy.get("h2.title > b").should("be.visible").and("contain", "Account Deleted!");
  })

  
})



