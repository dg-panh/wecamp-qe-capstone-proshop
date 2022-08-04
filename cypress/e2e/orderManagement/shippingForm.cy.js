import Cart from '../../pages/cart'
import Shipping from '../../pages/shipping'

describe('Shipping Information', () => {
    before(() => {
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        cy.addRandomProductToCart()
        Cart.clickCheckoutBtn()
        cy.wait(1000)
    })

    it('Verify that all field in shipping form are required', () => {
        Shipping.elements.addressTxt().should('have.attr', 'required')
        Shipping.elements.cityTxt().should('have.attr', 'required')
        Shipping.elements.postalCodeTxt().should('have.attr', 'required')
        Shipping.elements.countryTxt().should('have.attr', 'required')
    })

    it('Verify that the address entered by the user is valid', () => {
        cy.fillShippingInfo('')
    })

    afterEach(() => {
        cy.visit(Cypress.env('shipping_url'))
    })
})