import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Star, Zap, Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Western Cape Mortuary Finder",
  description:
    "Choose a plan for your mortuary listing. Free, Standard, or Premium — get more visibility and features.",
};

const TIERS = [
  {
    name: "Free",
    price: "R0",
    period: "forever",
    description: "Get listed and be found by families in your area.",
    icon: Zap,
    color: "border-gray-200",
    buttonClass: "bg-gray-800 hover:bg-gray-900 text-white",
    buttonText: "Get Started Free",
    features: [
      { text: "Listed on the platform", included: true },
      { text: "Name, address, phone number", included: true },
      { text: "Update availability status", included: true },
      { text: "Services & operating hours", included: false },
      { text: "WhatsApp button", included: false },
      { text: "Receive intake form submissions", included: false },
      { text: "Price range badge", included: false },
      { text: "View & contact analytics", included: false },
      { text: "Map pin", included: false },
      { text: "Receive reviews", included: false },
      { text: "Email notifications", included: false },
      { text: "Verified Partner badge", included: false },
      { text: "Priority placement", included: false },
      { text: "Featured on homepage", included: false },
    ],
  },
  {
    name: "Standard",
    price: "R299",
    period: "/month",
    description: "Everything you need to attract and serve more families.",
    icon: Star,
    color: "border-[#1B4965] ring-2 ring-[#1B4965]/20",
    buttonClass: "bg-[#1B4965] hover:bg-[#143A50] text-white",
    buttonText: "Upgrade to Standard",
    popular: true,
    features: [
      { text: "Listed on the platform", included: true },
      { text: "Name, address, phone number", included: true },
      { text: "Update availability status", included: true },
      { text: "Services & operating hours", included: true },
      { text: "WhatsApp button", included: true },
      { text: "Receive intake form submissions", included: true },
      { text: "Price range badge", included: true },
      { text: "View & contact analytics", included: true },
      { text: "Map pin", included: true },
      { text: "Receive reviews", included: false },
      { text: "Email notifications", included: false },
      { text: "Verified Partner badge", included: false },
      { text: "Priority placement", included: false },
      { text: "Featured on homepage", included: false },
    ],
  },
  {
    name: "Premium",
    price: "R599",
    period: "/month",
    description: "Maximum visibility and priority over competitors.",
    icon: Crown,
    color: "border-amber-400 ring-2 ring-amber-400/20",
    buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
    buttonText: "Go Premium",
    features: [
      { text: "Listed on the platform", included: true },
      { text: "Name, address, phone number", included: true },
      { text: "Update availability status", included: true },
      { text: "Services & operating hours", included: true },
      { text: "WhatsApp button", included: true },
      { text: "Receive intake form submissions", included: true },
      { text: "Price range badge", included: true },
      { text: "View & contact analytics", included: true },
      { text: "Map pin", included: true },
      { text: "Receive reviews", included: true },
      { text: "Email notifications", included: true },
      { text: "Verified Partner badge", included: true },
      { text: "Priority placement", included: true },
      { text: "Featured on homepage", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4965] to-[#5FA8D3] text-white py-16 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Plans That Grow With Your Business
        </h1>
        <p className="mt-3 text-lg text-blue-100 max-w-xl mx-auto">
          Start free and upgrade when you need more visibility and features.
        </p>
        <p className="mt-2 text-sm text-blue-200">
          One funeral booking pays for months of your subscription.
        </p>
      </section>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl border-2 ${tier.color} shadow-sm p-6 flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#1B4965] text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                    <Icon className="h-6 w-6 text-[#1B4965]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tier.name}
                  </h2>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-start gap-2.5 text-sm ${
                        feature.included ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/admin/register"
                  className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors ${tier.buttonClass}`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              q="Can I start with Free and upgrade later?"
              a="Yes. Start with a free listing and upgrade to Standard or Premium at any time. Your listing data carries over — nothing is lost."
            />
            <FaqItem
              q="How does a listing pay for itself?"
              a="A single funeral booking is worth R8,000 to R100,000. If your listing brings in even one extra client per month, the R299 or R599 subscription pays for itself many times over."
            />
            <FaqItem
              q="What does 'Priority placement' mean?"
              a="Premium mortuaries appear first in search results for their city. When a family searches for mortuaries, yours will be at the top of the list."
            />
            <FaqItem
              q="What is the Verified Partner badge?"
              a="A green badge that shows on your listing, giving families confidence that your mortuary has been verified by our team. Only available on the Premium plan."
            />
            <FaqItem
              q="Can I cancel anytime?"
              a="Yes. There are no contracts or lock-in periods. Cancel anytime and your listing reverts to the Free tier."
            />
            <FaqItem
              q="How do I pay?"
              a="Contact us to set up your subscription. We accept EFT and card payments."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="font-semibold text-gray-900 text-sm">{q}</h3>
      <p className="text-sm text-gray-600 mt-1">{a}</p>
    </div>
  );
}
