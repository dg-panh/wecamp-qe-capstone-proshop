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