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

const PrivacyPolicy = () => (
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
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-3 dark:text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Name, email address, and password</li>
          <li>Phone number and delivery address</li>
          <li>Order history and payment method preferences</li>
          <li>Communications you send us</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates via email</li>
          <li>Respond to your comments and questions</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="3. Information Sharing">
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Delivery partners to fulfill your orders</li>
          <li>Payment processors to handle transactions securely</li>
          <li>Service providers who assist in our operations</li>
          <li>Law enforcement when required by law</li>
        </ul>
      </Section>

      <Section title="4. Data Security">
        <p>We implement industry-standard security measures to protect your personal information, including:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Passwords are hashed using bcrypt (12 salt rounds)</li>
          <li>All API communications use JWT authentication</li>
          <li>HTTPS encryption for all data in transit</li>
          <li>Regular security audits and updates</li>
        </ul>
      </Section>

      <Section title="5. Cookies">
        <p>We use localStorage to store your authentication token and cart data. This data stays on your device and is not transmitted to third parties. You can clear this data at any time through your browser settings.</p>
      </Section>

      <Section title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Opt out of marketing communications</li>
        </ul>
        <p className="mt-2">To exercise these rights, contact us at <a href="mailto:support@motorly.com" className="text-primary hover:underline">support@motorly.com</a></p>
      </Section>

      <Section title="7. Contact Us">
        <p>If you have questions about this Privacy Policy, please contact us:</p>
        <ul className="list-none space-y-1 mt-2">
          <li>📧 support@motorly.com</li>
          <li>📍 Islamabad, Pakistan</li>
          <li>📞 +92 300 1234567</li>
        </ul>
      </Section>

      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
        <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
