class User {
    elements = {
        emailInput: () => cy.get('#email'),
        passwordInput: () => cy.get('#password'),
        loginBtn: () => cy.get('button[type="submit"]').filter(':contains("Sign In")'),
        errorMsg: () => cy.get('div[role="alert"]')
    }

    typeEmail(email) {
        this.elements.emailInput().type(email);
        return this
    }

    typePassword(password) {
        this.elements.passwordInput().type(password);
        return this
    }

    clickLogin() {
        this.elements.loginBtn().click();
        return this
    }
}

module.exports = new User();