
class Product {
    elements = {
        cardTitle: () => cy.get('.card-title'),
        cardImg: () => cy.xpath('//img[@class="card-img-top"]/parent::*'),
        addToCartBtn: () => cy.get('button[type="button"]').filter(':contains("Add To Cart")')
    }

    clickCardTitle(index) {
        this.elements.cardTitle().then((item) => {
            item[index].click()
        });
        return this
    }

    clickCardImg(index) {
        this.elements.cardImg().then((item) => {
            item[index].click()
        });
        return this
    }

    clickAddToCartBtn() {
        this.elements.addToCartBtn().click({ force: true });
        return this;
    }
}

module.exports = new Product()