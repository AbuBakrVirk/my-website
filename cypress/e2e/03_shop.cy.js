// ─────────────────────────────────────────────────────────────
// Shop Page Tests
// ─────────────────────────────────────────────────────────────

const EMAIL    = Cypress.env("testEmail");
const PASSWORD = Cypress.env("testPassword");
const FIRST    = Cypress.env("testFirstName");
const LAST     = Cypress.env("testLastName");

// ── Guest ──────────────────────────────────────────────────────
describe("Shop — Guest", () => {
  beforeEach(() => {
    cy.visit("/shop");
  });

  it("loads the shop page", () => {
    cy.url().should("include", "/shop");
  });

  it("shows navbar with logo", () => {
    cy.contains("Motorly").should("be.visible");
  });

  it("shows Sign In / Sign Up when not logged in", () => {
    cy.contains("Sign In").should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });

  it("shows Products section", () => {
    cy.contains("Products").should("be.visible");
  });

  it("shows Add to Cart and Buy Now on product cards", () => {
    cy.contains("Add to Cart").should("be.visible");
    cy.contains("Buy Now").should("be.visible");
  });

  it("shows Best Products section", () => {
    cy.contains("Best Products").should("be.visible");
  });

  it("shows Testimonials section", () => {
    cy.contains("Testimonials").should("be.visible");
  });

  it("Trending dropdown opens on click", () => {
    cy.contains("button", "Trending").click();
    cy.contains("Trending Products").should("be.visible");
    cy.contains("Best Selling").should("be.visible");
    cy.contains("Top Rated").should("be.visible");
  });

  it("Trending dropdown closes after clicking a link", () => {
    cy.contains("button", "Trending").click();
    cy.contains("Best Selling").click();
    cy.contains("Best Selling").should("not.exist");
  });

  it("Buy Now shows auth modal when not logged in", () => {
    cy.contains("Buy Now").first().click();
    cy.contains("Sign In Required").should("be.visible");
  });

  it("auth modal has Sign In and Create Account buttons", () => {
    cy.contains("Buy Now").first().click();
    cy.contains("Sign In Required").should("be.visible");
    cy.contains("Sign In").should("be.visible");
    cy.contains("Create Account").should("be.visible");
  });

  it("auth modal closes on Continue browsing", () => {
    cy.contains("Buy Now").first().click();
    cy.contains("Continue browsing").click();
    cy.contains("Sign In Required").should("not.exist");
  });
});

// ── Cart (Guest) ───────────────────────────────────────────────
describe("Shop — Cart (Guest)", () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.visit("/shop");
  });

  it("Cart button is visible in navbar", () => {
    cy.contains("Cart").should("be.visible");
  });

  it("Add to Cart adds item and shows badge count", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("1").should("be.visible");
  });

  it("cart drawer opens when Cart button clicked", () => {
    cy.contains("Cart").click();
    cy.contains("My Cart").should("be.visible");
  });

  it("empty cart shows empty state", () => {
    cy.contains("Cart").click();
    cy.contains("Your cart is empty").should("be.visible");
  });

  it("added item appears in cart drawer", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.contains("My Cart").should("be.visible");
    cy.contains("$").should("be.visible");
  });

  it("can increase item quantity in cart drawer", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.get(".fixed.top-0.right-0").contains("+").click();
    cy.get(".fixed.top-0.right-0").contains("2").should("be.visible");
  });

  it("can decrease item quantity in cart drawer", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.get(".fixed.top-0.right-0").contains("+").click();
    cy.get(".fixed.top-0.right-0").find("button").contains("−").click();
    cy.get(".fixed.top-0.right-0").contains("1").should("be.visible");
  });

  it("cart persists after page reload", () => {
    cy.contains("Add to Cart").first().click();
    cy.reload();
    cy.contains("1").should("be.visible");
  });

  it("checkout from cart when guest redirects to login", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.contains("Sign In to Checkout").click();
    cy.url().should("include", "/login");
  });

  it("shows free shipping nudge when under $100", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.contains("more for FREE shipping").should("be.visible");
  });
});

// ── Authenticated ──────────────────────────────────────────────
describe("Shop — Authenticated", () => {
  before(() => {
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  beforeEach(() => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/shop");
  });

  it("shows user first name in navbar", () => {
    cy.contains(FIRST).should("be.visible");
  });

  it("Buy Now opens checkout modal", () => {
    cy.contains("Buy Now").first().click();
    cy.contains("Checkout").should("be.visible");
  });

  it("checkout modal shows cart step with product", () => {
    cy.contains("Buy Now").first().click();
    cy.contains("Your Cart").should("be.visible");
    cy.contains("Continue →").should("be.visible");
  });

  it("Add to Cart then Proceed to Checkout opens checkout", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Cart").click();
    cy.contains("Proceed to Checkout").click();
    cy.contains("Checkout").should("be.visible");
  });

  it("user dropdown shows My Orders", () => {
    cy.contains(FIRST).click();
    cy.contains("My Orders").should("be.visible");
  });

  it("My Orders navigates to /orders", () => {
    cy.contains(FIRST).click();
    cy.contains("My Orders").click();
    cy.url().should("include", "/orders");
  });
});
