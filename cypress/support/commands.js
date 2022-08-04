// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// import User from '../../pages/user'
const User = require('../pages/user')
const Product = require('../pages/product')
import Shipping from '../pages/shipping'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

Cypress.Commands.add('login', (email, password) => {
    cy.visit(Cypress.env('login_url'))
    User.typeEmail(email).typePassword(password).clickLogin()
    cy.wait(5000)
})

Cypress.Commands.add('addToCart', (index) => {
    Product.clickCardImg(index)
    cy.wait(1000)
    Product.clickAddToCartBtn()

})

Cypress.Commands.add('addRandomProductToCart', () => {
    cy.visit('/')
    Product.elements.cardImg().then(item => {
        cy.addToCart(getRandomInt(item.length))
    })
})

Cypress.Commands.add('fillShippingInfo', (address, city, postalCode, country) => {
    Shipping.typeAddress(address)
    .typeCity(city)
    .typePostalCode(postalCode)
    .typeCountry(country)
    .clickSubmitBtn()
})

Cypress.Commands.add('signup', (account, fieldIsEmpty, valOfFieldEmpty) => {
    cy.visit(Cypress.env('signup_url'))
    cy.wait(1000)
    User.typeName(account.name)
    .typeEmail(account.email)
    .typePassword(account.password)
    .typeConfirmPassword(account.confirmPassword)
    if(fieldIsEmpty == 'name') {
        User.editName(valOfFieldEmpty)
    }
    if(fieldIsEmpty == 'email') {
        User.editEmail(valOfFieldEmpty)
    }
    if(fieldIsEmpty == 'password') {
        User.editPassword(valOfFieldEmpty)
    }
    if(fieldIsEmpty == 'confirmPassword') {
        User.editConfirmPassword(valOfFieldEmpty)
    }
    User.clickSignupBtn()
})