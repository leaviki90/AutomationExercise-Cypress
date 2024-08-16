AutomationExercise.com: Automation Testing with Cypress
==========================================

Project Overview
----------------

This project contains a suite of automated tests for an e-commerce website using the Cypress testing framework. The goal is to ensure the website's critical functionalities, such as user authentication, product management, and checkout processes, work as expected and provide a seamless user experience.

Features
--------

*   **User Authentication Tests**:
    
    *   Register a new user
        
    *   Login with correct email and password
        
    *   Attempt to login with incorrect email and password
        
    *   Logout functionality
        
    *   Register a user with an existing email
        
*   **Product and Cart Management Tests**:
    
    *   View all products and product detail pages
        
    *   Search for products
        
    *   Add products to the cart
        
    *   Verify product quantity in the cart
        
    *   Remove products from the cart
        
    *   View category-specific products
        
    *   View and add brand-specific products to the cart
        
    *   Add products to the cart from recommended items
        
    *   Search products and verify cart contents after login
        
*   **Checkout Process Tests**:
    
    *   Place an order while registering during checkout
        
    *   Place an order after registering before checkout
        
    *   Place an order by logging in before checkout
        
    *   Verify address details on the checkout page
        
    *   Download an invoice after placing an order
        
*   **Miscellaneous Tests**:
    
    *   Verify the Contact Us form functionality
        
    *   Verify the Test Cases page
        
    *   Verify subscription functionality on the home and cart pages
        
    *   Add a review on a product
        
    *   Verify scroll up and down functionality using the 'Arrow' button
        
    *   Verify scroll up and down functionality without using the 'Arrow' button
        

Tech Stack
----------

*   **Cypress**: The primary testing framework for writing and executing the automated tests.
    
*   **JavaScript**: The programming language used for test scripting.
    

## Setup and Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/leaviki90/automation-store.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd automation-store
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

## Running Tests

1. **To run all tests:**

    ```bash
    npm run cypress:open
    ```

    This will open the Cypress Test Runner where you can select and execute your tests.

2. **To run tests in headless mode:**

    ```bash
    npm run cypress:run
    ```

    

Test Cases
----------

The test cases are logically grouped as follows:

*   **User Authentication**: Tests related to user registration, login, logout, and handling existing users.
    
*   **Product and Cart Management**: Verifying product viewing, searching, adding to cart, and managing product quantities.
    
*   **Checkout Process**: Ensuring smooth checkout operations, including address verification, order placement, and invoice generation.
    
*   **Other Functionalities**: Tests covering the Contact Us form, subscription validation, review addition, and scroll functionality.
    

Contributions
-------------

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

License
-------

This project is licensed under the MIT License. See the [MIT License](/LICENSE.txt) file for details.
