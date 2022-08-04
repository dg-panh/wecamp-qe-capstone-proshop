class Shipping {
    elements = {
        addressTxt: () => cy.get('#address'),
        cityTxt: () => cy.get('#city'),
        postalCodeTxt: () => cy.get('#postalCode'),
        countryTxt: () => cy.get('#country'),
        submitBtn: () => cy.get('button[type="submit"]').contains('Continue')
    }

    typeAddress(address) {
        this.elements.addressTxt().type(address)
        return this
    }

    typeCity(city) {
        this.elements.cityTxt().type(city)
        return this
    }

    typePostalCode(postalCode) {
        this.elements.postalCodeTxt().type(postalCode)
        return this
    }

    typeCountry(country) {
        this.elements.countryTxt().type(country)
        return this
    }

    clickSubmitBtn() {
        this.elements.submitBtn().click()
        return this
    }
}

module.exports = new Shipping()