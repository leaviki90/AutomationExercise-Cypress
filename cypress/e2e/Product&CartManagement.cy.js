import {
    selectCategory, verifyCategoryAndSubCategory, selectBrand, checkBrandProductsVisibility, clickOnRecommendedItem,
    verifyRecommendedItem
} from '../support/CategoryHelpers';

describe("Product and Cart Management", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");
        //Verify that home page is visible successfully
        cy.url().should("include", "automationexercise");
        cy.title().should('eq', 'Automation Exercise');
        cy.xpath("//img[@alt='Website for automation practice']").should("exist").and("be.visible");
    });
    it("Verify All Products and Product Details page", () => {

        //Click on products button and verify that All products page is opened 
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


    it("Search products", () => {

        const productName = "winter";

        //Click on products and verify that All products page is opened 
        cy.get("a[href='/products']").click();
        cy.get("a[href='/products']").should("have.css", "color", "rgb(255, 165, 0)");
        cy.url().should("contain", "products");
        cy.title().should("contain", "Automation Exercise - All Products");

        //Enter product name in search input and click search button
        cy.get("#search_product").type(productName);
        cy.get("#search_product").should("have.value", productName);
        cy.get("#submit_search").click();

        //Verify 'SEARCHED PRODUCTS' is visible
        cy.get(".title.text-center").should("exist").and("be.visible").and("contain", "Searched Products");

        //Verify all the products related to search are visible
        cy.get("body").then($body => {
            if ($body.find(".productinfo").length > 0) {
                // If product exist, the each loop starts
                cy.get(".productinfo").should("be.visible").each(($product) => {
                    cy.wrap($product).within(() => {
                        cy.get("p").invoke("text").then((text) => {
                            expect(text.toLowerCase()).to.include(productName);
                        });
                    });
                });
                cy.get(".productinfo").should('have.length.greaterThan', 0);
            } else {
                // If product doesn't exist, send message
                cy.log("No such product");
            }
        });

    })


    it("Add products to the cart", () => {

        // Variables to store product IDs
        let firstProductId;
        let secondProductId;
        let firstProductPrice;
        let secondProductPrice;
        const quantity = 1; // Quantity is 1 for both

        // This function returns the total price
        let calculateTotalPrice = (price, quantity) => {
            return price * quantity;
        }

        //Click on "Products" button  
        cy.get("a[href='/products']").click();

        //Hover over first product and click 'Add to cart'
        cy.get(".product-overlay").first().trigger("mouseover", { force: true });
        cy.get('.product-overlay').first().within(() => {
            // Invokes `data-product-id` atribute from `a` element
            cy.get('a').invoke('attr', 'data-product-id').then((id) => {
                firstProductId = id;


                // Invokes number from `<h2>` element
                cy.get('h2').invoke('text').then((text) => {
                    firstProductPrice = +text.replace(/[^0-9]/g, '');
                    cy.log(`Product ID: ${firstProductId}, Price: ${firstProductPrice}`);
                    cy.log(typeof firstProductPrice);
                });
            });
        });
        cy.get('.product-overlay').first().contains('Add to cart').click({ force: true });

        //Click 'Continue Shopping' button
        cy.get(".close-modal").click();

        //Hover over second product and click 'Add to cart'
        cy.get(".product-overlay").eq(1).trigger("mouseover", { force: true });
        cy.get('.product-overlay').eq(1).within(() => {
            cy.get("a").invoke('attr', 'data-product-id').then((id) => {
                secondProductId = id;
                // Invokes number from `<h2>` element
                cy.get('h2').invoke('text').then((text) => {
                    secondProductPrice = text.replace(/[^0-9]/g, '');
                    cy.log(`Product ID: ${secondProductId}, Price: ${secondProductPrice}`);
                });
            });
        });

        cy.get('.product-overlay').eq(1).contains('Add to cart').click({ force: true });

        //Click 'View Cart' button
        cy.get(".modal-body a").click();

        //Verify both products are added to Cart
        cy.get('.cart_info').within(() => {
            cy.get(`a[data-product-id='${firstProductId}']`).should('exist');
            cy.get(`a[data-product-id='${secondProductId}']`).should('exist');
        });

        // Verify prices, quantity and total price for the first product
        cy.get('tbody tr').each(($tr) => {
            const rowId = $tr.attr('id');

            if (rowId && rowId.includes(firstProductId)) {
                cy.wrap($tr).within(() => {
                    cy.get('.cart_price').should('contain', `Rs. ${firstProductPrice}`);
                    cy.get('.cart_quantity').should('contain', quantity.toString());
                    cy.get('.cart_total_price').should('contain', `Rs. ${calculateTotalPrice(firstProductPrice, quantity)}`);

                });
            }
        });

        // Verify prices, quantity and total price for the second product
        cy.get('tbody tr').each(($tr) => {
            const rowId = $tr.attr('id');

            if (rowId && rowId.includes(secondProductId)) {
                cy.wrap($tr).within(() => {
                    cy.get('.cart_price').should('contain', `Rs. ${secondProductPrice}`);
                    cy.get('.cart_quantity').should('contain', quantity.toString());
                    cy.get('.cart_total_price').should('contain', `Rs. ${calculateTotalPrice(secondProductPrice, quantity)}`);
                });
            }
        });
    });

    it("Verify product quantity in the cart", () => {
        const productId = 1;
        const quantity = 4;

        //Click 'View Product' for any product on home page
        cy.get(`a[href='/product_details/${productId}']`).click();

        //Verify product detail is opened
        cy.url().should('include', `/product_details/${productId}`);

        //Increase quantity to 4
        cy.get("#quantity").clear().type(quantity);

        //Click 'Add to cart' button
        cy.get(".cart").click();

        //Click 'View Cart' button
        cy.get("p[class='text-center'] a").click();

        //Verify that product is displayed in cart page with exact quantity
        cy.get(".cart_quantity button").should("contain", quantity);

    })

    it("Remove products from the cart", () => {
        let productName;
        //Add products to cart (3 products)
        //first product
        cy.get(".product-image-wrapper").first().scrollIntoView({ duration: 2000 }); //scroll
        cy.get(".product-image-wrapper").first().find(".product-overlay .add-to-cart").click({ force: true });//click on product
        cy.get(".close-modal").click(); //continue
        //second product
        cy.get(".product-image-wrapper").eq(1).find(".product-overlay .add-to-cart").click({ force: true });//click on product
        cy.get(".product-image-wrapper").eq(1).find(".product-overlay p").then(($p) => {
            productName = $p.text();
        });
        cy.get(".close-modal").click();//continue
        //third product
        cy.get(".product-image-wrapper").eq(31).scrollIntoView(); //scroll
        cy.get(".product-image-wrapper").eq(31).find(".product-overlay .add-to-cart").click({ force: true });//click on product
        cy.get(".close-modal").click();//continue

        //Click "Cart" button
        cy.get("a[href='/view_cart']").first().click();

        //Verify that cart page is displayed
        cy.url().should("include", "view_cart");
        cy.get(".btn.btn-default.check_out").should("be.visible");

        //Click 'X' button corresponding to particular product (second)
        cy.get("tbody > tr").eq(1).within(() => {
            cy.get(".cart_delete").click();
        })

        //Verify that product is removed from the cart
        cy.get("tbody").should("not.have.text", productName);
    })


    it("View category-specific products", () => {
        // Verify that categories are visible on the left sidebar
        cy.get(".panel-group.category-products").should("be.visible");

        // Select and verify 'Women' category and its specific subcategory
        selectCategory("#Women", "Dress");
        verifyCategoryAndSubCategory('category_products/1');

        // Select and verify 'Men' category and its specific subcategory
        selectCategory('#Men', "Tshirts");
        verifyCategoryAndSubCategory('category_products/3');
    });


    it("View brand-specific products", () => {
        //Click on 'Products' button
        cy.get("a[href='/products']").click();

        //Verify that Brands are visible on left side bar
        cy.get(".left-sidebar > .brands_products").should("be.visible");

        //Selects a brand by its name, clicks it if found, and stores the cleaned brand name for later use.
        selectBrand("H&M");
        //Check that title contains selected brend name and visibility of its products
        checkBrandProductsVisibility();
        selectBrand("Polo");
        checkBrandProductsVisibility();

    })


    it("Add products to the cart from recommended items", () => {
        //Scroll to bottom of page
        cy.get("#footer").scrollIntoView({ duration: 2000 });

        //Verify 'RECOMMENDED ITEMS' are visible
        cy.get(".recommended_items > .title").should("be.visible");

        //Click on 'Add To Cart' on Recommended product
        clickOnRecommendedItem("Winter Top");

        //Click 'View Cart' button
        cy.get(".modal-body a").click();

        //Verify that product is displayed in cart page
        verifyRecommendedItem();
    })

    it.only("Search products and verify cart contents after login", () => {
        const productName = "Sleeves Top";

        // Click on "Products" button and verify that "All products page" is opened 
        cy.get("a[href='/products']").click();
        cy.get("a[href='/products']").should("have.css", "color", "rgb(255, 165, 0)");
        cy.url().should("contain", "products");
        cy.title().should("contain", "Automation Exercise - All Products");

        // Use custom command to search and add products to the cart
        cy.searchAndAddProductsToCart(productName);

        // Click 'Cart' button and verify that products are visible in the cart
        cy.get("a[href='/view_cart']").first().click({ force: true });
        cy.get('.cart_description').each(($product) => {
            cy.wrap($product).should('be.visible');
        });

        // Click 'Signup / Login' button and submit login details
        cy.fixture('userDetails').then((user) => {
            cy.createUserProfile(user); // Use custom command to create profile via API

            // Go to the Login page and login with valid credentials
            cy.get("a[href='/login']").first().click();
            cy.get(".login-form > h2").should("contain", "Login to your account").and("be.visible");
            cy.get("input[data-qa='login-email']").type(user.email);
            cy.get("input[placeholder='Password']").type(user.password);
            cy.get("button[data-qa='login-button']").click();
        });

        // Again, go to "Cart" page
        cy.get("a[href='/view_cart']").first().click({ force: true });

        // Verify that those products are visible in cart after login as well
        cy.get("a[href='/view_cart']").first().click({ force: true });
        cy.get('.cart_description').each(($product) => {
            cy.wrap($product).should('be.visible');
        });
    });

});



