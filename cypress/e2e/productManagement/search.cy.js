import Header from '../../pages//header'
import Product from '../../pages/product'

const keywordInHappyCase = 'phone'
const keywordInSadCase = 'laptop'

describe('Search Product', () => {
    beforeEach(() => {
        cy.visit("/")
        // cy.wait(10000)
    })

    it('Verify when a user searches for a product that exists in the product list', () => {
        Header.typeSearchText(keywordInHappyCase)
        Header.clickSearchBtn()
        Product.elements.cardTitle().should('include.text', keywordInHappyCase)
    })

    it('Verify when a user searches for a product that DOES NOT exist in the product list', () => {
        Header.typeSearchText(keywordInSadCase)
        Header.clickSearchBtn()
        cy.get('.container').should('not.exist', Product.elements.cardTitle())
    })
})