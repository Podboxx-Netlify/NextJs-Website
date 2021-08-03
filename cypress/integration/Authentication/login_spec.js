describe('Logging In', function () {
    // we can use these values to log in
    const email = 'tommy.cote+3@podboxx.com'
    const password = 'Abc12345'

    context('Unauthorized', function () {
        it('is redirected on visit to /login when no session', function () {
            // we must have a valid session token to be logged
            // in else we are redirected to /login
            cy.visit('http://localhost:5000/user/subscriptions')
            cy.wait(6000)
            cy.url().should('include', 'login')
        })
    })

    context('Login Form Submission', function () {
        beforeEach(function () {
            cy.visit('http://localhost:5000/user/login');
            window.localStorage.setItem('channel', 31)
        })

        it('displays errors on login', function () {
            // incorrect username on purpose
            cy.get('input[name=email]').type('shouldnt@work')
            cy.get('input[name=password]').type('password123{enter}')

            // we should have visible errors now and still be on the same URL
            cy.contains('Please verify your credentials and try again.')
            cy.url().should('include', '/login')
        })

        it('redirects to / on success', function () {
            cy.get('input[name=email]').type(email)
            cy.get('input[name=password]').type(password)
            cy.get('form').submit()

            // we should be redirected to home page
            cy.url().should('equal', 'http://localhost:5000/')
            cy.get('.Toastify__toast-body').should('contain', 'Signed in successfully')

            cy.window()
                .its("localStorage")
                .invoke("getItem", "J-tockAuth-Storage")
                .should("exist");
        })
    })

    context('Reusable "login" custom command', function () {
        beforeEach(function () {
            // login before each test
            cy.login(email, password)
        })
        it('should be logged and not get redirected', function () {
            cy.visit('http://localhost:5000/user/subscriptions')
            cy.wait(6000)
            cy.url().should('include', 'subscriptions')
        })
        it('Change Subscription', function () {
            cy.visit('http://localhost:5000/user/subscriptions')
            cy.debug()
        })

    })
})