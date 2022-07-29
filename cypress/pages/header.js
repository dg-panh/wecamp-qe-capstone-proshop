class Header {
    elements = {
        header: () => cy.get('header'),
        username: () => cy.get('#username'),
        loginBtn: () => cy.get('a[data-rb-event-key="/login"]'),
        searchInput: () => cy.get('input[name="q"]'),
        searchBtn: () => cy.get('button[type="submit"]').filter(':contains("Search")')
    }

    typeSearchText(keyword) {
        this.elements.searchInput().type(keyword)
        return this
    }

    clickLogin() {
        this.elements.loginBtn().click()
        return this
    }

    clickSearchBtn() {
        this.elements.searchBtn().click()
        return this
    }
}

module.exports = new Header();