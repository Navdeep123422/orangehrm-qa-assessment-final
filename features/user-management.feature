Feature: Admin user management
  As an administrator
  I want to find and create users
  So that access to OrangeHRM can be managed reliably

  @Smoke
  Scenario: Admin can log in, search for an existing user, and log out
    Given the administrator is logged in
    When the administrator opens user management
    And searches for the existing username "Admin"
    Then the user search results should contain username "Admin"
    When the administrator logs out
    Then the login page should be displayed

  @Regression
  Scenario: Admin creates a new enabled ESS user and verifies it was saved
    Given the administrator is logged in
    When the administrator opens user management
    And creates a new enabled ESS user with a unique username
    Then a successful save notification should be displayed
    When the administrator searches for the newly created username
    Then the user search results should contain the newly created username
    When the administrator logs out
    Then the login page should be displayed
