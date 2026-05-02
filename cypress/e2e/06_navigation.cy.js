// ─────────────────────────────────────────────────────────────
// Navigation & Responsive Layout Tests
// ─────────────────────────────────────────────────────────────

describe("Route Navigation", () => {
  it("/ loads landing page", () => {
    cy.visit("/");
    cy.contains("Upgrade").should("be.visible");
  });

  it("/shop loads shop page", () => {
    cy.visit("/shop");
    cy.contains("Products").should("be.visible");
  });

  it("/login loads login page", () => {
    cy.visit("/login");
    cy.contains("Welcome Back").should("be.visible");
  });

  it("/register loads register page", () => {
    cy.visit("/register");
    cy.contains("Create Account").should("be.visible");
  });

  it("/forgot-password loads forgot password page", () => {
    cy.visit("/forgot-password");
    cy.contains("Forgot Password").should("be.visible");
  });

  it("/orders redirects to /login when not authenticated", () => {
    cy.clearAuth();
    cy.visit("/orders");
    cy.url().should("include", "/login");
  });

  it("login page logo navigates to /", () => {
    cy.visit("/login");
    cy.get("img[alt='logo']").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("register page has link to login", () => {
    cy.visit("/register");
    cy.contains("Sign in").click();
    cy.url().should("include", "/login");
  });

  it("login page has link to register", () => {
    cy.visit("/login");
    cy.contains("Create an account").click();
    cy.url().should("include", "/register");
  });

  it("login page has link to forgot password", () => {
    cy.visit("/login");
    cy.contains("Forgot password?").click();
    cy.url().should("include", "/forgot-password");
  });

  it("forgot password page has link back to login", () => {
    cy.visit("/forgot-password");
    cy.contains("Back to Sign In").click();
    cy.url().should("include", "/login");
  });
});

describe("Responsive Layout", () => {
  const viewports = [
    { name: "Mobile S",  width: 375,  height: 667  },
    { name: "Mobile L",  width: 425,  height: 812  },
    { name: "Tablet",    width: 768,  height: 1024 },
    { name: "Laptop",    width: 1024, height: 768  },
    { name: "Desktop",   width: 1280, height: 720  },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`landing renders on ${name} (${width}x${height})`, () => {
      cy.viewport(width, height);
      cy.visit("/");
      cy.contains("Motorly").should("be.visible");
      cy.contains("Upgrade").should("be.visible");
    });

    it(`shop renders on ${name} (${width}x${height})`, () => {
      cy.viewport(width, height);
      cy.visit("/shop");
      cy.contains("Products").should("be.visible");
    });

    it(`login renders on ${name} (${width}x${height})`, () => {
      cy.viewport(width, height);
      cy.visit("/login");
      cy.contains("Welcome Back").should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
    });

    it(`register renders on ${name} (${width}x${height})`, () => {
      cy.viewport(width, height);
      cy.visit("/register");
      cy.contains("Create Account").should("be.visible");
    });
  });
});
