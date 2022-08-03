class Cart {
    elements = {
        productName: () => cy.get('.col-md-3 > a'),
        selectQuantity: () => cy.get('div[id="0"] > select'),
        selectOptionInQuantity: () => cy.get('div[id="0"] > select > option'),
        removeBtn: () => cy.get('button > i'),
        msgAlert: () => cy.get('[role="alert"]'),
        subtotalTxt: () => cy.get('h2').contains('Subtotal'),
        totalAmount: () => cy.xpath('//h2/parent::*'),
        checkoutBtn: () => cy.get('button').contains('Proceed To Checkout')
    }

    checkSelectQuantity(option) {
        this.elements.selectQuantity().select(option).should('have.value', option)
        return this
    }

    clickRemoveBtn(index) {
        this.elements.removeBtn().then(item => {
            item[index].click()
        })
        return this
    }

    clickCheckoutBtn() {
        this.elements.checkoutBtn().click()
        return this
    }
}

module.exports = new Cart()