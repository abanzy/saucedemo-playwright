# Documentation only (not wired to Cucumber)

Feature: SauceDemo cart and checkout

  Background:
    Given the user opens the SauceDemo login page
    And the user logs in as "standard_user" with the demo password

  @smoke
  Scenario: Happy-path checkout completes order
    When the user adds a product to the cart
    And the user proceeds through checkout with valid information
    Then the order confirmation is shown

  Scenario: Add item and validate cart contents
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    Then the cart lists "Sauce Labs Backpack"

  Scenario: Multiple items appear in the cart
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    And the user opens the cart
    Then the cart lists both products

  Scenario: Remove item from cart before checkout
    When the user adds a product to the cart
    And the user removes that product from the cart
    Then the cart shows no items for that product

  @negative
  Scenario Outline: Checkout blocks when a required field is missing
    When the user adds a product to the cart
    And the user starts checkout
    And the user continues with "<field>" left blank
    Then the user remains on checkout step one with a validation error for "<field>"

    Examples:
      | field        |
      | First Name   |
      | Last Name    |
      | Postal Code  |

  # Known demo defect. Per ISTQB, this should fail in a production environment.
  @edge
  Scenario Outline: Checkout accepts whitespace-only required fields on the live demo
    When the user adds a product to the cart
    And the user starts checkout
    And the user continues with "<field>" set to whitespace only
    Then the user advances to checkout overview

    Examples:
      | field        |
      | First Name   |
      | Last Name    |
      | Postal Code  |

  # Known demo defect. Per ISTQB, this should fail in a production environment.
  @edge
  Scenario: Empty-cart checkout completes on the live demo
    When the user opens the cart with no items
    And the user attempts checkout
    Then checkout completes with zero cart items

  Scenario: Inventory survives a page refresh after login
    When the user is on the products page
    And the user refreshes the browser
    Then the products page is still shown

  Scenario: Cart item survives a page refresh
    When the user adds "Sauce Labs Backpack" to the cart
    And the user refreshes the browser
    Then the cart badge still shows 1
    And the cart still lists "Sauce Labs Backpack"

  Scenario: Multiple cart items survive a page refresh
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    And the user refreshes the browser
    Then the cart badge still shows 2
    And the cart still lists both products

  Scenario: Session survives browser back from cart to inventory
    When the user opens the cart with no items
    And the user navigates back in the browser
    Then the products page is still shown
