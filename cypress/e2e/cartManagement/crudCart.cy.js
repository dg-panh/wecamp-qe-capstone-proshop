import Product from '../../pages/product'
import Cart from '../../pages/cart'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

describe('Add to cart', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it.only('Verify that the product will appear when the user add product to the cart', () => {
        Product.elements.cardTitle().then(item => {
            const index = getRandomInt(item.length)
            const title = item[index].innerText
            cy.addToCart(index) 
            cy.url().should('include', Cypress.env('cart_url'))
            cy.wait(1000)
            Cart.elements.productName().should('have.text', title)
        })    
    })
})

describe('CRUD in Cart', () => {
    beforeEach(() => {
        cy.visit('/')
        Product.elements.cardImg().then(item => {
            cy.addToCart(getRandomInt(item.length)) 
        })    
    })

    it('Verify that the product quantity will validly change when the user increases or decreases the number of products in the cart', () => {
        Cart.checkSelectQuantity("3")
    })

    it('Verify that the product disappears when the user removes it from the cart', () => {
        Cart.elements.productName().then(item => {
            const index = getRandomInt(item.length)
            const title = item[index].innerText
            Cart.clickRemoveBtn(index)
            cy.wait(1000)
            Cart.elements.productName().should('not.exist', title)
        })
    })

    it('Verify that if cart is empty, system show message empty cart', () => {
        Cart.elements.productName().then(item => {
            for (let index = 0; index < item.length; index++) {
                Cart.clickRemoveBtn(index)
            }
        })
        cy.wait(1000)
        Cart.elements.msgAlert().should('have.text', 'Your cart is empty Go Back')
    })

    it('Verify that when updating the quantity of any product, the total items of the cart is updated correctly', () => {
        Cart.checkSelectQuantity('3')
        Cart.elements.subtotalTxt().should('contain', '3')
    })
})