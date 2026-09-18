"use client";

import { useState } from "react";

const BRAND_NAME = "Trouble Maker Bangladesh";
const SUPPORT_PHONE = "01974004221";
const SUPPORT_EMAIL = "support@troublemakerbd.com"; // তোমার আসল ইমেইল দিয়ে বদলে নাও

type PolicyTab = "privacy" | "shipping" | "return" | "payment" | "terms";

const TABS: { id: PolicyTab; label: string }[] = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "return", label: "Return & Exchange" },
  { id: "payment", label: "Payment Policy" },
  { id: "terms", label: "Terms & Conditions" },
];

const sectionTitle = "text-lg font-bold text-gray-900 mb-2";
const sectionText = "text-sm leading-relaxed text-gray-600 mb-4";
const listClasses =
  "list-disc list-inside text-sm leading-relaxed text-gray-600 space-y-1.5 mb-4";

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState<PolicyTab>("privacy");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900">
          Store Policies
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {BRAND_NAME} — please read our policies carefully before ordering.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 border-b border-gray-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        {activeTab === "privacy" && (
          <div>
            <h2 className={sectionTitle}>Privacy Policy</h2>
            <p className={sectionText}>
              At {BRAND_NAME}, we respect your privacy and are committed to
              protecting the personal information you share with us. This policy
              explains what information we collect and how we use it.
            </p>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Information We Collect
            </h3>
            <ul className={listClasses}>
              <li>Name, phone number, and delivery address</li>
              <li>Email address (if provided)</li>
              <li>Order history and payment/transaction reference</li>
              <li>Device and browser information for site analytics</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              How We Use Your Information
            </h3>
            <ul className={listClasses}>
              <li>To process and deliver your orders</li>
              <li>To contact you regarding order confirmation and delivery</li>
              <li>To improve our products, services, and website experience</li>
              <li>To send promotional offers (only if you opt in)</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Data Protection
            </h3>
            <p className={sectionText}>
              We do not sell, rent, or trade your personal information to third
              parties. Your data is stored securely and used solely for order
              processing and customer service purposes.
            </p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <h2 className={sectionTitle}>Shipping Policy</h2>
            <p className={sectionText}>
              We currently deliver across Bangladesh through trusted courier
              partners. Delivery charges and timelines vary by location.
            </p>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Delivery Charges
            </h3>
            <ul className={listClasses}>
              <li>Inside Dhaka: ৳80</li>
              <li>Outside Dhaka: ৳150</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Delivery Time
            </h3>
            <ul className={listClasses}>
              <li>Inside Dhaka: 2–3 business days</li>
              <li>Outside Dhaka: 3–5 business days</li>
            </ul>

            <p className={sectionText}>
              Delivery times may vary during festive seasons or due to
              unforeseen courier delays. We will notify you if your order is
              expected to take longer than usual.
            </p>
          </div>
        )}

        {activeTab === "return" && (
          <div>
            <h2 className={sectionTitle}>Return & Exchange Policy</h2>
            <p className={sectionText}>
              We want you to love your purchase. If something isn&apos;t right,
              here&apos;s how our exchange policy works.
            </p>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Eligibility
            </h3>
            <ul className={listClasses}>
              <li>
                Exchange is available only for non-printed / non-customized
                products
              </li>
              <li>
                Product must be unused, unwashed, and in original condition
              </li>
              <li>Original tag must be intact</li>
              <li>Exchange request must be made within 3 days of delivery</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Not Eligible for Exchange
            </h3>
            <ul className={listClasses}>
              <li>Printed, customized, or made-to-order products</li>
              <li>Products damaged due to misuse</li>
              <li>Products without original tags or packaging</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              How to Request an Exchange
            </h3>
            <p className={sectionText}>
              Contact us via WhatsApp or phone at {SUPPORT_PHONE} with your
              order ID and reason for exchange. Our team will guide you through
              the next steps.
            </p>

            <p className="text-xs text-red-500">
              Note: We do not offer cash refunds. Only size/product exchange is
              available under eligible conditions.
            </p>
          </div>
        )}

        {activeTab === "payment" && (
          <div>
            <h2 className={sectionTitle}>Payment Policy</h2>
            <p className={sectionText}>
              We currently accept advance payments via mobile financial services
              to confirm orders.
            </p>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Accepted Payment Methods
            </h3>
            <ul className={listClasses}>
              <li>bKash</li>
              <li>Nagad</li>
              <li>Rocket</li>
            </ul>

            <h3 className="mb-1.5 text-sm font-bold text-gray-800">
              Advance Payment
            </h3>
            <p className={sectionText}>
              A partial advance payment is required to confirm your order. This
              helps us reduce fraudulent and fake orders, ensuring a smooth
              experience for genuine customers. The remaining amount is paid via
              Cash on Delivery (COD) upon receiving the product.
            </p>

            <p className="text-xs text-red-500">
              Orders without advance payment confirmation will not be processed.
              Please provide accurate transaction details.
            </p>
          </div>
        )}

        {activeTab === "terms" && (
          <div>
            <h2 className={sectionTitle}>Terms & Conditions</h2>
            <p className={sectionText}>
              By placing an order with {BRAND_NAME}, you agree to the following
              terms and conditions.
            </p>

            <ul className={listClasses}>
              <li>All product prices are listed in Bangladeshi Taka (৳)</li>
              <li>
                Product images are for illustration; actual color may vary
                slightly due to lighting/screen settings
              </li>
              <li>
                We reserve the right to cancel any order suspected of fraud or
                misuse
              </li>
              <li>
                Delivery timelines are estimates and may vary due to external
                factors
              </li>
              <li>
                Customers must provide accurate shipping and contact information
              </li>
              <li>
                All disputes are subject to resolution under applicable
                Bangladeshi law
              </li>
            </ul>

            <p className={sectionText}>
              These terms may be updated periodically without prior notice.
              Continued use of our website and services implies acceptance of
              the latest terms.
            </p>
          </div>
        )}
      </div>

      {/* CONTACT FOOTER */}
      <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-center">
        <p className="text-sm font-semibold text-gray-800">
          Have a question about our policies?
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Contact us at{" "}
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="font-semibold text-black hover:underline"
          >
            {SUPPORT_PHONE}
          </a>{" "}
          or{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-semibold text-black hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
};

export default PolicyPage;
