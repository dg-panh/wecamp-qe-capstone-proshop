class User {
    elements = {
        emailInput: () => cy.get('#email'),
        passwordInput: () => cy.get('#password'),
        loginBtn: () => cy.get('button[type="submit"]').filter(':contains("Sign In")'),
        errorMsg: () => cy.get('div[role="alert"]'),
        nameInput: () => cy.get('#name'),
        confirmPassInput: () => cy.get('#confirmPassword'),
        signupBtn: () => cy.get('button[type="submit"]').contains('Register')
    }

    typeEmail(email) {
        this.elements.emailInput().type(email);
        return this
    }

    editEmail(email) {
        this.elements.emailInput().clear().type(email)
        return this
    }

    typePassword(password) {
        this.elements.passwordInput().type(password);
        return this
    }

    editPassword(password) {
        this.elements.passwordInput().clear().type(password)
    }

    typeName(name) {
        this.elements.nameInput().type(name)
        return this
    }

    editName(name) {
        this.elements.nameInput.clear().type(name)
    }

    typeConfirmPassword(password) {
        this.elements.confirmPassInput().type(password)
        return this
    }

    editConfirmPassword(password) {
        this.elements.confirmPassInput().clear().type(password)
    }

    clickLogin() {
        this.elements.loginBtn().click();
        return this
    }

    clickSignupBtn() {
        this.elements.signupBtn().click()
        cy.wait(1000)
        return this
    }
}

module.exports = new User();