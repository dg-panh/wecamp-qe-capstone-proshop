class Product {
    elements = {
        cardTitle: () => cy.get('.card-title')
    }
}

module.exports = new Product()