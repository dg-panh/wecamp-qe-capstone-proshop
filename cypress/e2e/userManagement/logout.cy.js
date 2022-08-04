import Header from '../../pages/header'

describe('Test logout feature', () => {
    before(() => {
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        Header.clickLogout()
    })
    it('Verify that login button will display in navbar when user click logout', () => {
        Header.elements.loginBtn().should('have.text', ' Sign In')
    })

    it('Verify that system will redirect login page when user click logout', () => {
        cy.url().should('include', Cypress.env('login_url'))
    })
})