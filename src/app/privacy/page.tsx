import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Western Cape Mortuary Finder",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8 text-center">Last updated: 7 April 2026</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
          <p>
            Western Cape Mortuary Finder (&quot;the Platform&quot;) is committed to protecting your personal information in compliance with the Protection of Personal Information Act, 2013 (POPIA) of South Africa. This policy explains what information we collect, why, and how we protect it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-4">From Families (Intake Form)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Deceased&apos;s personal details (name, ID number, date of birth, date of death, gender, address, marital status)</li>
            <li>Death circumstances (location, hospital, SAPS case number)</li>
            <li>Doctor&apos;s details (name, practice number, phone)</li>
            <li>Next-of-kin details (name, ID number, phone, email, address, relationship)</li>
            <li>Burial/cremation preferences and religious requirements</li>
            <li>Insurance/funeral policy details</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4">From Mortuary Owners</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email address and password (for account access)</li>
            <li>Mortuary business details (name, address, phone, services, hours)</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4">Automatically Collected</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Page view counts (anonymised, no personal data)</li>
            <li>Contact button clicks (anonymised counts only)</li>
            <li>Language preference (stored in browser cookie)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Purpose of Collection</h2>
          <p>We collect personal information solely for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Intake form submissions:</strong> To transmit your details to the selected mortuary so they can arrange funeral services</li>
            <li><strong>Owner accounts:</strong> To allow mortuary owners to manage their listings</li>
            <li><strong>Analytics:</strong> To provide mortuary owners with anonymised usage statistics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Who Has Access to Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Intake form data:</strong> Shared only with the specific mortuary you selected. No other mortuaries or third parties can see your submission.</li>
            <li><strong>Owner data:</strong> Your login credentials are encrypted. Your mortuary details are publicly visible on the Platform.</li>
            <li>We do <strong>not</strong> sell, rent, or share personal information with any third parties for marketing purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Data Storage and Security</h2>
          <p>
            All data is stored securely using Supabase, a cloud database platform with enterprise-grade security including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encryption at rest and in transit (TLS/SSL)</li>
            <li>Row-Level Security (RLS) — mortuary owners can only access their own data</li>
            <li>Authentication with encrypted passwords</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Your Rights Under POPIA</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access</strong> your personal information held by us</li>
            <li><strong>Correct</strong> inaccurate information</li>
            <li><strong>Delete</strong> your information (subject to legal requirements)</li>
            <li><strong>Object</strong> to the processing of your information</li>
            <li><strong>Withdraw consent</strong> at any time</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us via the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Data Retention</h2>
          <p>
            Intake form submissions are retained for the duration necessary to complete funeral arrangements. Mortuary owner accounts and listing data are retained for as long as the account remains active.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Cookies</h2>
          <p>
            We use a single cookie to store your language preference (English, Afrikaans, or isiXhosa). No tracking cookies, advertising cookies, or analytics cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &quot;last updated&quot; date at the top of this page reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
          <p>
            For privacy-related queries, requests, or complaints, please contact us via the Platform.
          </p>
        </section>
      </div>
    </main>
  );
}
