import "./commands";

// Suppress known third-party library errors that aren't test failures
Cypress.on("uncaught:exception", (err) => {
  const ignore = [
    "ResizeObserver loop",
    "AOS",
    "slick",
    "Cannot read properties of undefined",
    "Non-Error promise rejection",
  ];
  if (ignore.some((msg) => err.message.includes(msg))) return false;
});
