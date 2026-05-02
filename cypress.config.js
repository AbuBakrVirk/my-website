const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    env: {
      apiUrl: "http://localhost:5000/api",
      testEmail: "cypress_test@motorly.com",
      testPassword: "Test@1234",
      testFirstName: "Cypress",
      testLastName: "Tester",
    },
  },
});
