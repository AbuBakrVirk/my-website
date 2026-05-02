// ─────────────────────────────────────────────────────────────
// Checkout Flow Tests
// ─────────────────────────────────────────────────────────────

const EMAIL    = Cypress.env("testEmail");
const PASSWORD = Cypress.env("testPassword");
const FIRST    = Cypress.env("testFirstName");
const LAST     = Cypress.env("testLastName");

// Helper — fills delivery form
const fillDelivery = () => {
  cy.get('input[placeholder="123 Main Street"]').type("123 Test Street");
  cy.get('input[placeholder="New York"]').type("Lahore");
  cy.get('input[placeholder="10001"]').type("54000");
  cy.get('input[placeholder="+1 234 567 8900"]').type("+92 300 1234567");
};

describe("Checkout Modal", () => {
  before(() => {
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  beforeEach(() => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/shop");
    cy.contains("Buy Now").first().click();
    cy.contains("Checkout").should("be.visible");
  });

  it("shows 4-step progress bar", () => {
    cy.contains("Cart").should("be.visible");
    cy.contains("Delivery").should("be.visible");
    cy.contains("Payment").should("be.visible");
    cy.contains("Confirm").should("be.visible");
  });

  it("step 1 shows cart with product and price", () => {
    cy.contains("Your Cart").should("be.visible");
    cy.contains("$").should("be.visible");
  });

  it("shows order summary totals", () => {
    cy.contains("Subtotal").should("be.visible");
    cy.contains("Shipping").should("be.visible");
    cy.contains("Tax").should("be.visible");
    cy.contains("Total").should("be.visible");
  });

  it("can increase quantity in cart step", () => {
    cy.contains("+").first().click();
    cy.contains("2").should("be.visible");
  });

  it("Continue advances to delivery step", () => {
    cy.contains("Continue →").click();
    cy.contains("Delivery Details").should("be.visible");
  });

  it("delivery step shows logged-in user email", () => {
    cy.contains("Continue →").click();
    cy.contains(EMAIL).should("be.visible");
  });

  it("delivery step shows validation errors on empty submit", () => {
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Address is required").should("be.visible");
    cy.contains("City is required").should("be.visible");
  });

  it("can fill delivery and advance to payment", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Payment Method").should("be.visible");
  });

  it("payment step shows all 3 options", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Cash on Delivery").should("be.visible");
    cy.contains("Credit / Debit Card").should("be.visible");
    cy.contains("Bank Transfer").should("be.visible");
  });

  it("selecting Credit Card shows info notice", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Credit / Debit Card").click();
    cy.contains("encrypted and secure").should("be.visible");
  });

  it("confirm step shows full order summary", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Order Summary").should("be.visible");
    cy.contains("123 Test Street").should("be.visible");
    cy.contains("Cash on Delivery").should("be.visible");
    cy.contains("Place Order").should("be.visible");
  });

  it("confirm step shows email confirmation notice", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains(EMAIL).should("be.visible");
  });

  it("Back button returns to previous step", () => {
    cy.contains("Continue →").click();
    cy.contains("Delivery Details").should("be.visible");
    cy.contains("← Back").click();
    cy.contains("Your Cart").should("be.visible");
  });

  it("places full order and shows receipt", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Place Order").click();
    cy.contains("Order Confirmed", { timeout: 15000 }).should("be.visible");
    cy.contains("ORD-").should("be.visible");
    cy.contains("Thank you").should("be.visible");
  });

  it("receipt shows Print Receipt button", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Place Order").click();
    cy.contains("Print Receipt", { timeout: 15000 }).should("be.visible");
  });

  it("receipt shows order items and totals", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Place Order").click();
    cy.contains("Order Items", { timeout: 15000 }).should("be.visible");
    cy.contains("Total Paid").should("be.visible");
  });

  it("Continue Shopping closes receipt", () => {
    cy.contains("Continue →").click();
    fillDelivery();
    cy.contains("Continue →").click();
    cy.contains("Continue →").click();
    cy.contains("Place Order").click();
    cy.contains("Continue Shopping", { timeout: 15000 }).click();
    cy.contains("Checkout").should("not.exist");
  });
});
