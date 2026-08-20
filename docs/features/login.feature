# Documentation only (not wired to Cucumber)

Feature: SauceDemo login

  @smoke
  Scenario: Successful login shows the products page
    Given the user opens the SauceDemo login page
    When the user logs in as "standard_user" with the demo password
    Then the products page is shown

  @negative
  Scenario: Invalid login credentials are rejected
    Given the user opens the SauceDemo login page
    When the user submits username "standard_user" with password "wrong_password"
    Then an authentication error is shown
    And the user remains on the login page

  @negative
  Scenario: Locked-out user cannot log in
    Given the user opens the SauceDemo login page
    When the user submits username "locked_out_user" with the demo password
    Then a locked-out error is shown
    And the user remains on the login page
