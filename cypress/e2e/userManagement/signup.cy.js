import Header from '../../pages/header'
import User from '../../pages/user'

describe('Test sign up feature', () => {
    beforeEach(() => {
        cy.fixture("account.json").as("accountData")
    })

    it('Verify that system will not allow sign up when the user is logged in', () => {
        //login
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        Header.elements.username().should('have.id', 'username')
        //check
        cy.visit(Cypress.env('signup_url'))
        cy.url().should('eq', 'http://localhost:3000')
    })

    it('Verify that all field in sign up form are required', () => {
        User.elements.nameInput().should('have.attr', 'required')
        User.elements.emailInput().should('have.attr', 'required')
        User.elements.passwordInput().should('have.attr', 'required')
        User.elements.confirmPassInput().should('have.attr', 'required')
    })

    it('Verify that the system will redirect the homepage when the user registers successfully', () => {
        cy.get("@accountData").then((account) => {
            cy.signup(account.accountValid)
            cy.url().should('eq', 'http://localhost:3000/')
            Header.elements.username().should('have.text', account.accountValid.name)
        })
    })

    it.only('Verify that user can not sign in when user type duplicate email with other account', () => {
        cy.get("@accountData").then((account) => {
            cy.signup(account.accountValid)
            cy.url().should('eq', 'http://localhost:3000/')
            Header.elements.username().should('have.text', account.accountValid.name)
        })
    })
})