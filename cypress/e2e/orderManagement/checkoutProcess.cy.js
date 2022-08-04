import Product from '../../pages/product'
import Cart from '../../pages/cart'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

describe('Step by step in checkout process', () => {
    it('Verify that when user want checkout, system will redirect login page if user has not login', () => {
        cy.addRandomProductToCart()
        Cart.clickCheckoutBtn()
        cy.wait(1000)
        cy.url().should('include', Cypress.env('login_url'))
    })

    it('Verify that when user want checkout, system will redirect shipping page if user had login', () => {  
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        cy.addRandomProductToCart()
        Cart.clickCheckoutBtn()
        cy.wait(1000)
        cy.url().should('include', Cypress.env('shipping_url'))
    })

    it('Verify that the user cannot access the shipping page by typing the URL in the browser when the cart is empty', () => {
        cy.visit(Cypress.env('shipping_url'))
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:3000')
    })

    it('Verify that the user cannot access the shipping page by typing the URL in the browser when user has not logged in', () => {
        cy.addRandomProductToCart()
        cy.visit(Cypress.env('shipping_url'))
        cy.wait(1000)
        cy.url().should('include', Cypress.env('login_url'))
    })

    it('Verify that the user cannot access the payment page by typing the URL in the browser when user have not submit the shipping form', () => {
        cy.addRandomProductToCart()
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        cy.visit(Cypress.env('payment_url'))
        cy.wait(1000)
        cy.url().should('include', Cypress.env('shipping_url'))
    })

    it('Verify that the user cannot access the place order page by typing the URL in the browser when user have not submit the shipping form', () => {
        cy.addRandomProductToCart()
        cy.login(Cypress.env('cus_email'), Cypress.env('cus_pass'))
        cy.visit(Cypress.env('placeorder_url'))
        cy.wait(1000)
        cy.url().should('include', Cypress.env('shipping_url'))
    })

    it('Verify that the system does not allow the user to deselect the option to pay by PayPal or Credit Card', () => {
        
    })
})