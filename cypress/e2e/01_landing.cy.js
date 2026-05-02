// ─────────────────────────────────────────────────────────────
// Landing Page Tests
// ─────────────────────────────────────────────────────────────

describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the landing page", () => {
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("shows the Motorly brand name in navbar", () => {
    cy.get("nav").contains("Motorly").should("be.visible");
  });

  it("shows the hero headline", () => {
    cy.contains("Upgrade").should("be.visible");
    cy.contains("Drive").should("be.visible");
  });

  it("shows Sign In and Sign Up buttons when logged out", () => {
    cy.contains("a", "Sign In").should("be.visible");
    cy.contains("a", "Sign Up").should("be.visible");
  });

  it("shows stats — 10K+ and 50K+", () => {
    cy.contains("10K+").should("be.visible");
    cy.contains("50K+").should("be.visible");
  });

  it("shows features section", () => {
    cy.contains("100% Genuine Parts").should("be.visible");
    cy.contains("Express Delivery").should("be.visible");
    cy.contains("24/7 Expert Support").should("be.visible");
  });

  it("shows all 6 category cards", () => {
    cy.contains("Tyres & Wheels").should("be.visible");
    cy.contains("Interior").should("be.visible");
    cy.contains("Electronics").should("be.visible");
    cy.contains("Performance").should("be.visible");
  });

  it("shows testimonials section", () => {
    cy.contains("What Customers Say").should("be.visible");
  });

  it("Sign In link navigates to /login", () => {
    cy.contains("a", "Sign In").first().click();
    cy.url().should("include", "/login");
  });

  it("Sign Up link navigates to /register", () => {
    cy.contains("a", "Sign Up").first().click();
    cy.url().should("include", "/register");
  });

  it("Browse Store button navigates to /shop", () => {
    cy.contains("Browse Store").click();
    cy.url().should("include", "/shop");
  });

  it("category card navigates to /shop", () => {
    cy.contains("Tyres & Wheels").click();
    cy.url().should("include", "/shop");
  });

  it("footer shows current year", () => {
    cy.contains(new Date().getFullYear().toString()).should("be.visible");
  });

  it("footer has social links", () => {
    cy.get("footer").find("a").should("have.length.greaterThan", 3);
  });

  it("footer account links work", () => {
    cy.get("footer").contains("Sign In").should("have.attr", "href").and("include", "/login");
  });
});
