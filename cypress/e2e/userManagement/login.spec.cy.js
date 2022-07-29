import User from '../../pages/user'
import Header from '../../pages/header'

const testLogin = require('../../fixtures/data-driven/user/accountLogin.json');

describe('Test Login Feature', () => {

    testLogin.forEach(testData => {
        it(testData.description, () => {
            cy.login(testData.email, testData.password)
            // cy.wait(10000)

            if(testData.description === 'Should login successfully with admin role' || 
                testData.description === 'Should login successfully with customer role') {
                    Header.elements.username().should('have.text', testData.expected)
            } else {
                User.elements.errorMsg().should('have.text', testData.expected)
            }
        })
    })

    it('Verify when the user is logged in, the login button on the header disappears', () => {
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        Header.elements.header().should('not.exist', Header.elements.loginBtn())
    })

    it('Verify that if the cookie exists, the user can no access the login page', () => {
        
    })
})