import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Western Cape Mortuary Finder",
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8 text-center">Last updated: 7 April 2026</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. About This Service</h2>
          <p>
            Western Cape Mortuary Finder (&quot;the Platform&quot;) is an online directory that connects bereaved families with mortuaries in the Western Cape, South Africa. The Platform is operated by its owner (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Use of the Platform</h2>
          <p>By accessing this Platform, you agree to these Terms. The Platform provides:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>A directory of mortuaries with availability status</li>
            <li>Contact information for listed mortuaries</li>
            <li>A digital intake form to submit details to a mortuary</li>
            <li>An owner portal for mortuary operators to manage their listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. No Guarantee of Availability</h2>
          <p>
            Mortuary availability shown on the Platform is based on information provided by mortuary owners. We do not guarantee the accuracy or timeliness of availability status. Always confirm directly with the mortuary before making arrangements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Intake Form Submissions</h2>
          <p>
            The digital intake form collects personal information about the deceased and the next-of-kin. By submitting this form, you consent to this information being shared with the selected mortuary for the purpose of arranging funeral services. This information is not shared with any other third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Mortuary Owner Responsibilities</h2>
          <p>Mortuary owners who register on the Platform agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate and up-to-date information about their mortuary</li>
            <li>Keep their availability status current</li>
            <li>Handle all intake submissions with confidentiality and care</li>
            <li>Comply with all applicable South African laws, including the Protection of Personal Information Act (POPIA)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p>
            The Platform acts as a directory and communication tool only. We are not a funeral service provider and do not participate in any arrangements between families and mortuaries. We are not liable for:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The quality of services provided by any listed mortuary</li>
            <li>Inaccurate information provided by mortuary owners</li>
            <li>Any disputes between families and mortuaries</li>
            <li>Any loss or damage arising from the use of this Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Intellectual Property</h2>
          <p>
            All content on this Platform, including design, text, and code, is the property of the Platform owner and is protected by South African copyright law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Platform constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Contact</h2>
          <p>
            For any questions about these Terms, please contact us via the Platform.
          </p>
        </section>
      </div>
    </main>
  );
}
