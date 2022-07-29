Feature: Test Login Feature

    Background: 
        Given A user visit a login page
    Scenario: Login Successfully
        When A user enters the valid email
        And A user enters the valid passwoord
        And A user clicks on the login button
        Then Navbar of Proshop will contains the username