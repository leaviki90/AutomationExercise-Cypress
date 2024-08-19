
describe("Product and Cart Management", () => {
    it("Verify All Products and Product Details page", () => {
        cy.visit("/");

        // Validate URL and page elements
        cy.url().should("include", "automationexercise");
        cy.title().should('eq', 'Automation Exercise');
        cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");

        //Click on products and verify that All products page is opened 
        cy.get("a[href='/products']").click();
        cy.get("a[href='/products']").should("have.css", "color", "rgb(255, 165, 0)");
        cy.url().should("contain", "products");
        cy.title().should("contain", "Automation Exercise - All Products")

        //Product list is visible
        cy.get('.features_items .col-sm-4').should('have.length.greaterThan', 0);
        cy.get('.features_items .col-sm-4').each(($el) => {
            cy.wrap($el).should('be.visible');
        });

        //Click on first product on "View product" button
        cy.get("a[href='/product_details/1']").first().click();

        //Verify that user is redirected to Product Details page
        cy.url().should("contain", "product_details");
        cy.get("button[type='button']").should("contain", "Add to cart").and("be.visible");

        //Verify that detail detail is visible: product name, category, price, availability, condition, brand
        cy.get(".product-information h2").should('be.visible').and('contain.text', 'Blue Top');
        cy.get('.product-information p').eq(0).should('be.visible').and('contain.text', 'Category: Women > Tops');
        cy.get('.product-information span span').should('be.visible').and('contain.text', 'Rs. 500');
        cy.get('.product-information p').eq(1).should('be.visible').and('contain.text', 'Availability: In Stock');
        cy.get('.product-information p').eq(2).should('be.visible').and('contain.text', 'Condition: New');
        cy.get('.product-information p').eq(3).should('be.visible').and('contain.text', 'Brand: Polo');
    })


})