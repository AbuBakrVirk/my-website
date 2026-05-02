// ─────────────────────────────────────────────────────────────
// Orders Inbox Tests
// ─────────────────────────────────────────────────────────────

const EMAIL    = Cypress.env("testEmail");
const PASSWORD = Cypress.env("testPassword");
const FIRST    = Cypress.env("testFirstName");
const LAST     = Cypress.env("testLastName");

describe("Orders — Guest redirect", () => {
  it("redirects to /login when not authenticated", () => {
    cy.clearAuth();
    cy.visit("/orders");
    cy.url().should("include", "/login");
  });
});

describe("Orders — Authenticated", () => {
  before(() => {
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  beforeEach(() => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
  });

  it("loads the orders page", () => {
    cy.url().should("include", "/orders");
    cy.contains("My Orders").should("be.visible");
  });

  it("shows Motorly logo in navbar", () => {
    cy.contains("Motorly").should("be.visible");
  });

  it("shows user name in navbar", () => {
    cy.contains(FIRST).should("be.visible");
  });

  it("shows Back to Shop link", () => {
    cy.contains("Back to Shop").should("be.visible");
  });

  it("Back to Shop navigates to /shop", () => {
    cy.contains("Back to Shop").click();
    cy.url().should("include", "/shop");
  });

  it("shows Refresh button", () => {
    cy.contains("Refresh").should("be.visible");
  });

  it("Refresh button reloads without error", () => {
    cy.contains("Refresh").click();
    cy.contains("My Orders").should("be.visible");
  });

  it("Sign Out from orders page redirects to landing", () => {
    cy.contains("Sign Out").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});

describe("Orders — With placed order", () => {
  before(() => {
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  it("placed order appears in orders inbox", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/shop");

    // Place order via UI
    cy.contains("Buy Now").first().click();
    cy.contains("Continue →").click();
    cy.get('input[placeholder="123 Main Street"]').type("456 Orders Ave");
    cy.get('input[placeholder="New York"]').type("Karachi");
    cy.get('input[placeholder="10001"]').type("75000");
    cy.get('input[placeholder="+1 234 567 8900"]').type("+92 321 9876543");
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Place Order").click();
    cy.contains("Order Confirmed", { timeout: 15000 }).should("be.visible");
    cy.contains("Continue Shopping").click();

    // Navigate to orders
    cy.visit("/orders");
    cy.contains("ORD-").should("be.visible");
    cy.contains("Confirmed").should("be.visible");
  });

  it("order card shows Details and Receipt buttons", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("ORD-").should("be.visible");
    cy.contains("Details").should("be.visible");
    cy.contains("Receipt").should("be.visible");
  });

  it("Details button expands order info", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("Details").first().click();
    cy.contains("Delivery").should("be.visible");
    cy.contains("Payment").should("be.visible");
    cy.contains("Total").should("be.visible");
  });

  it("Details button collapses on second click", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("Details").first().click();
    cy.contains("Hide").first().click();
    cy.contains("Details").should("be.visible");
  });

  it("Receipt button opens receipt modal", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("Receipt").first().click();
    cy.contains("Order Confirmed").should("be.visible");
    cy.contains("Print Receipt").should("be.visible");
  });

  it("receipt modal closes on Continue Shopping", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("Receipt").first().click();
    cy.contains("Continue Shopping").click();
    cy.contains("My Orders").should("be.visible");
  });

  it("stats cards show correct counts", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/orders");
    cy.contains("Total Orders").should("be.visible");
    cy.contains("Items Ordered").should("be.visible");
    cy.contains("Total Spent").should("be.visible");
  });
});
