// ─────────────────────────────────────────────────────────────
// Authentication Tests
// ─────────────────────────────────────────────────────────────

const EMAIL     = Cypress.env("testEmail");
const PASSWORD  = Cypress.env("testPassword");
const FIRST     = Cypress.env("testFirstName");
const LAST      = Cypress.env("testLastName");

// ── Register ──────────────────────────────────────────────────
describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("renders all form fields", () => {
    cy.contains("Create Account").should("be.visible");
    cy.get('input[name="firstName"]').should("exist");
    cy.get('input[name="lastName"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="confirmPassword"]').should("exist");
    cy.get('input[name="agreeTerms"]').should("exist");
  });

  it("shows validation errors on empty submit", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });

  it("shows error when passwords do not match", () => {
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("different999");
    cy.get('input[name="agreeTerms"]').check();
    cy.get('button[type="submit"]').click();
    cy.contains("Passwords do not match").should("be.visible");
  });

  it("shows password strength indicator", () => {
    cy.get('input[name="password"]').type("abc");
    cy.contains("Weak").should("be.visible");
    cy.get('input[name="password"]').clear().type("Abcdef1!");
    cy.contains("Strong").should("be.visible");
  });

  it("show/hide password toggle works", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.get('input[name="password"]').parent().find("button").click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
  });

  it("Sign in link navigates to /login", () => {
    cy.contains("Sign in").click();
    cy.url().should("include", "/login");
  });

  it("registers successfully and redirects to /shop", () => {
    const unique = `cy_${Date.now()}@motorly.com`;
    cy.get('input[name="firstName"]').type(FIRST);
    cy.get('input[name="lastName"]').type(LAST);
    cy.get('input[name="email"]').type(unique);
    cy.get('input[name="password"]').type(PASSWORD);
    cy.get('input[name="confirmPassword"]').type(PASSWORD);
    cy.get('input[name="agreeTerms"]').check();
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/shop");
    cy.window().its("localStorage").invoke("getItem", "motorly_token").should("exist");
  });
});

// ── Login ──────────────────────────────────────────────────────
describe("Login Page", () => {
  before(() => {
    // Ensure the test user exists (ignore 409 if already registered)
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders the login form", () => {
    cy.contains("Welcome Back").should("be.visible");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("shows validation errors on empty submit", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });

  it("shows error for invalid email format", () => {
    cy.get('input[name="email"]').type("notanemail");
    cy.get('button[type="submit"]').click();
    cy.contains("valid email").should("be.visible");
  });

  it("shows error for wrong password", () => {
    cy.get('input[name="email"]').type(EMAIL);
    cy.get('input[name="password"]').type("wrongpassword999");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid email or password").should("be.visible");
  });

  it("show/hide password toggle works", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.get('input[name="password"]').parent().find("button").click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
  });

  it("Forgot password? link navigates to /forgot-password", () => {
    cy.contains("Forgot password?").click();
    cy.url().should("include", "/forgot-password");
  });

  it("Create an account link navigates to /register", () => {
    cy.contains("Create an account").click();
    cy.url().should("include", "/register");
  });

  it("logs in with correct credentials and redirects to /shop", () => {
    cy.get('input[name="email"]').type(EMAIL);
    cy.get('input[name="password"]').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/shop");
    cy.window().its("localStorage").invoke("getItem", "motorly_token").should("exist");
  });

  it("session persists after page reload", () => {
    cy.get('input[name="email"]').type(EMAIL);
    cy.get('input[name="password"]').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/shop");
    cy.reload();
    cy.url().should("include", "/shop");
    cy.contains(FIRST).should("be.visible");
  });
});

// ── Forgot Password ────────────────────────────────────────────
describe("Forgot Password Page", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("renders the form", () => {
    cy.contains("Forgot Password").should("be.visible");
    cy.get('input[type="email"]').should("exist");
  });

  it("shows error on empty submit", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Email is required").should("be.visible");
  });

  it("shows error for invalid email", () => {
    cy.get('input[type="email"]').type("bademail");
    cy.get('button[type="submit"]').click();
    cy.contains("valid email").should("be.visible");
  });

  it("shows success state after submit", () => {
    cy.get('input[type="email"]').type("anyone@example.com");
    cy.get('button[type="submit"]').click();
    cy.contains("Check Your Email").should("be.visible");
  });

  it("Back to Sign In link works", () => {
    cy.contains("Back to Sign In").click();
    cy.url().should("include", "/login");
  });
});

// ── Logout ─────────────────────────────────────────────────────
describe("Logout", () => {
  before(() => {
    cy.register(FIRST, LAST, EMAIL, PASSWORD);
  });

  it("logs out and redirects to landing page", () => {
    cy.loginViaApi(EMAIL, PASSWORD);
    cy.visit("/shop");
    cy.contains(FIRST).should("be.visible");
    cy.contains(FIRST).click();
    cy.contains("Sign Out").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    cy.window().its("localStorage").invoke("getItem", "motorly_token").should("be.null");
  });
});
