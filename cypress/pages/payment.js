class Payment {
    elements = {
        selectMethod: () => cy.get('input[type="radio"]')
    }

    unCheckSelectMethod() {
        this.elements.selectMethod().uncheck()
    }
}

module.exports = new Payment()