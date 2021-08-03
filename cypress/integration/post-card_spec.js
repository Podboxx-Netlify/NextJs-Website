// post-card_spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Post test', function () {
    it('Displays a post page', function () {
        cy.visit('http://localhost:5000/')
        cy.get('.btn > span')
        // expect(true).to.equal(true)
    })
})