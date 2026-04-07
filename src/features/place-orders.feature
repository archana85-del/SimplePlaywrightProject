Feature: Place orders from CSV data
@Login
  Scenario: Place orders for all rows from csv
    Given I load the user details from the csv file
    When I place orders for each user from the csv data
    Then all orders should be placed successfully