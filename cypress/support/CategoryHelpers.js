// View category-specific products - test case

// Function to select a category and store its text, with dynamic category ID and subcategory text
export function selectCategory(categoryId, subCategoryText) {
    cy.get(".panel-title > a").filter(`a[href="${categoryId}"]`).as('categoryLink');
    cy.get('@categoryLink').should('be.visible').then(($link) => {
        const category = $link.text().trim(); // Extract the category text and remove whitespace
        cy.log(category); // Log the category text
        cy.wrap($link).click(); // Click on the category element
        cy.wrap(category).as('category'); // Store the category value as an alias
    });

    // Ensure the selected category section is visible
    cy.get(categoryId).should('be.visible'); // Ensure the category section is visible before selecting subcategory

    // Select the subcategory by its text
    cy.get(`${categoryId} > .panel-body > ul > li > a`).contains(subCategoryText).as('subCategoryLink');
    cy.get('@subCategoryLink').should('be.visible').then(($link) => {
        const subCategory = $link.text().trim(); // Extract the subcategory text and remove whitespace
        cy.log(subCategory); // Log the subcategory text
        cy.wrap($link).click(); // Click on the subcategory element
        cy.wrap(subCategory).as('subCategory'); // Store the subcategory value as an alias
    });
}

// Function to verify the category and subcategory texts with dynamic path verification
export function verifyCategoryAndSubCategory(expectedCategoryPath) {
    cy.location('pathname').should('include', expectedCategoryPath); // Verify the URL includes the expected path

    cy.get(".title.text-center").invoke("text").then((text) => {
        const extractedText = text.trim(); // Remove whitespace from the title text
        const [categoryText, subCategoryText] = extractedText.split(" - ").map(part => part.trim()); // Split by " - " and trim spaces

        // Log extracted texts for debugging
        cy.log(`Extracted Category Text: ${categoryText}`);
        cy.log(`Extracted SubCategory Text: ${subCategoryText}`);

        // Verify that the title text matches the selected category and subcategory
        cy.get('@category').then((category) => {
            cy.log(`Expected Category: ${category}`);
            expect(categoryText).to.include(category); // Check if extracted category includes expected category
        });
        cy.get('@subCategory').then((subCategory) => {
            cy.log(`Expected SubCategory: ${subCategory}`);
            expect(subCategoryText).to.include(subCategory); // Check if extracted subcategory includes expected subcategory
        });
    });
}

//View and add brand-specific products to the cart - test case

//Selects a brand by its name, clicks it if found, and stores the cleaned brand name for later use.
export function selectBrand(brand) {
    // Select the element containing the brand name and filter by text
    cy.get('.brands_products .brands-name a')
        .contains(brand)
        .then(($brend) => {

            // Ensure the link is visible and click on it
            cy.wrap($brend)
                .should('be.visible')
                .click();

            // Save the cleaned brand name for later use
            const brandName = $brend.text().trim().replace(/\(\d+\)/, '');
            cy.wrap(brandName).as('selectedBrand');
        });
}


// Check that title contains selected brend name and visibility of its products
export function checkBrandProductsVisibility() {
    cy.get('@selectedBrand').then((selectedBrand) => { //get the alias
        //check that title contains selected brand name
        cy.get(".features_items > .title")
            .should('be.visible')
            .and('contain.text', selectedBrand);
    });

    cy.get(".features_items .productinfo").should('be.visible');

}
