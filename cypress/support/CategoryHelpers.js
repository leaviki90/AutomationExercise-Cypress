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
