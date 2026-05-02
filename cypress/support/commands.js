// ─────────────────────────────────────────────────────────────
// Custom Cypress commands for Motorly
// ─────────────────────────────────────────────────────────────

/**
 * cy.register(firstName, lastName, email, password)
 * Creates a user via API. Ignores 409 (already exists).
 */
Cypress.Commands.add("register", (firstName, lastName, email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/auth/register`,
    body: { firstName, lastName, email, password },
    failOnStatusCode: false,
  });
});

/**
 * cy.loginViaApi(email, password)
 * Logs in via API and writes the JWT into the app's localStorage.
 * Faster than going through the login UI — use for non-auth tests.
 */
Cypress.Commands.add("loginViaApi", (email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/auth/login`,
    body: { email, password },
  }).then(({ body }) => {
    cy.window().then((win) => {
      win.localStorage.setItem("motorly_token", body.token);
      win.localStorage.setItem("motorly_user", JSON.stringify(body.user));
    });
  });
});

/**
 * cy.clearAuth()
 * Removes auth tokens from localStorage.
 */
Cypress.Commands.add("clearAuth", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("motorly_token");
    win.localStorage.removeItem("motorly_user");
    win.localStorage.removeItem("motorly_cart");
  });
});

/**
 * cy.logout()
 * Alias for clearAuth — keeps old tests working.
 */
Cypress.Commands.add("logout", () => {
  cy.clearAuth();
});
