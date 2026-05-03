import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import DarkMode from "../components/Navbar/DarkMode";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-3 dark:text-white">{title}</h2>
    <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsOfService = () => (
  <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen">
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={logo} alt="Motorly" className="w-8 h-8" />
          <span className="dark:text-white">Motorly</span>
        </Link>
        <div className="flex items-center gap-3">
          <DarkMode />
          <Link to="/shop" className="bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:scale-105 duration-200">Shop Now</Link>
        </div>
      </div>
    </nav>

    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <span className="text-primary text-sm font-bold uppercase tracking-widest">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-3 dark:text-white">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By accessing and using Motorly, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
      </Section>

      <Section title="2. Account Registration">
        <p>To place orders, you must create an account. You agree to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your password</li>
          <li>Notify us immediately of any unauthorized use</li>
          <li>Be responsible for all activity under your account</li>
        </ul>
      </Section>

      <Section title="3. Orders and Payment">
        <p>When you place an order:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>You confirm that all information provided is accurate</li>
          <li>Prices are in USD and subject to change without notice</li>
          <li>We reserve the right to cancel orders for any reason</li>
          <li>Payment is due at the time of order placement</li>
          <li>Cash on Delivery orders must be paid upon receipt</li>
        </ul>
      </Section>

      <Section title="4. Shipping and Delivery">
        <ul className="list-disc list-inside space-y-1">
          <li>Estimated delivery: 3–5 business days within Pakistan</li>
          <li>Free shipping on orders over $100</li>
          <li>We are not responsible for delays caused by courier services</li>
          <li>Risk of loss passes to you upon delivery</li>
        </ul>
      </Section>

      <Section title="5. Returns and Refunds">
        <ul className="list-disc list-inside space-y-1">
          <li>Returns accepted within 7 days of delivery</li>
          <li>Items must be unused and in original packaging</li>
          <li>Refunds processed within 5–7 business days</li>
          <li>Shipping costs for returns are the customer's responsibility</li>
          <li>Damaged or defective items will be replaced at no cost</li>
        </ul>
      </Section>

      <Section title="6. Intellectual Property">
        <p>All content on Motorly, including text, images, logos, and software, is the property of Motorly and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>Motorly shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the specific order in question.</p>
      </Section>

      <Section title="8. Changes to Terms">
        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.</p>
      </Section>

      <Section title="9. Contact">
        <p>For questions about these Terms, contact us at <a href="mailto:support@motorly.com" className="text-primary hover:underline">support@motorly.com</a></p>
      </Section>

      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  </div>
);

export default TermsOfService;
