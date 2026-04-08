"use client";

import Link from "next/link";
import { Check, X, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

const FEATURE_KEYS: TranslationKey[] = [
  "pricing.feat.listed",
  "pricing.feat.nameAddressPhone",
  "pricing.feat.availability",
  "pricing.feat.services",
  "pricing.feat.whatsapp",
  "pricing.feat.intake",
  "pricing.feat.priceRange",
  "pricing.feat.analytics",
  "pricing.feat.map",
  "pricing.feat.reviews",
  "pricing.feat.email",
  "pricing.feat.verified",
  "pricing.feat.priority",
  "pricing.feat.featured",
];

const FREE_INCLUDED = [true, true, true, false, false, false, false, false, false, false, false, false, false, false];
const STANDARD_INCLUDED = [true, true, true, true, true, true, true, true, true, false, false, false, false, false];
const PREMIUM_INCLUDED = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

const FAQ_KEYS: [TranslationKey, TranslationKey][] = [
  ["pricing.faq1Q", "pricing.faq1A"],
  ["pricing.faq2Q", "pricing.faq2A"],
  ["pricing.faq3Q", "pricing.faq3A"],
  ["pricing.faq4Q", "pricing.faq4A"],
  ["pricing.faq5Q", "pricing.faq5A"],
  ["pricing.faq6Q", "pricing.faq6A"],
];

export default function PricingPage() {
  const { t } = useLanguage();

  const tiers = [
    {
      nameKey: "pricing.free" as TranslationKey,
      price: "R0",
      periodKey: "pricing.forever" as TranslationKey,
      descKey: "pricing.freeDesc" as TranslationKey,
      icon: Zap,
      color: "border-gray-200",
      buttonClass: "bg-gray-800 hover:bg-gray-900 text-white",
      buttonKey: "pricing.getStarted" as TranslationKey,
      included: FREE_INCLUDED,
    },
    {
      nameKey: "pricing.standard" as TranslationKey,
      price: "R299",
      periodKey: "pricing.perMonth" as TranslationKey,
      descKey: "pricing.standardDesc" as TranslationKey,
      icon: Star,
      color: "border-[#1B4965] ring-2 ring-[#1B4965]/20",
      buttonClass: "bg-[#1B4965] hover:bg-[#143A50] text-white",
      buttonKey: "pricing.upgradeStandard" as TranslationKey,
      popular: true,
      included: STANDARD_INCLUDED,
    },
    {
      nameKey: "pricing.premium" as TranslationKey,
      price: "R599",
      periodKey: "pricing.perMonth" as TranslationKey,
      descKey: "pricing.premiumDesc" as TranslationKey,
      icon: Crown,
      color: "border-amber-400 ring-2 ring-amber-400/20",
      buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
      buttonKey: "pricing.goPremium" as TranslationKey,
      included: PREMIUM_INCLUDED,
    },
  ];

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("pricing.backToDashboard")}
        </Link>
      </div>

      <section className="bg-gradient-to-br from-[#1B4965] to-[#5FA8D3] text-white py-16 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">{t("pricing.title")}</h1>
        <p className="mt-3 text-lg text-blue-100 max-w-xl mx-auto">{t("pricing.subtitle")}</p>
        <p className="mt-2 text-sm text-blue-200">{t("pricing.oneBooking")}</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.nameKey} className={`relative bg-white rounded-2xl border-2 ${tier.color} shadow-sm p-6 flex flex-col`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#1B4965] text-white text-xs font-bold px-4 py-1 rounded-full">
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                    <Icon className="h-6 w-6 text-[#1B4965]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t(tier.nameKey)}</h2>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-sm text-gray-500">{t(tier.periodKey)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{t(tier.descKey)}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {FEATURE_KEYS.map((key, i) => (
                    <li key={key} className={`flex items-start gap-2.5 text-sm ${tier.included[i] ? "text-gray-700" : "text-gray-400"}`}>
                      {tier.included[i] ? <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> : <X className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />}
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/admin/register" className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors ${tier.buttonClass}`}>
                  {t(tier.buttonKey)}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("pricing.faqTitle")}</h2>
          <div className="space-y-6">
            {FAQ_KEYS.map(([qKey, aKey]) => (
              <div key={qKey} className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 text-sm">{t(qKey)}</h3>
                <p className="text-sm text-gray-600 mt-1">{t(aKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
