"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4965] text-white">
                <Heart className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                {t("header.brand")}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  {t("header.findMortuary")}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/register"
                  className="hover:text-gray-900 transition-colors"
                >
                  {t("footer.registerMortuary")}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-gray-900 transition-colors"
                >
                  {t("footer.ownerLogin")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              {t("footer.cities")}
            </h3>
            <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
              <li>
                <Link href="/mortuaries/cape-town" className="hover:text-gray-900 transition-colors">
                  Cape Town
                </Link>
              </li>
              <li>
                <Link href="/mortuaries/stellenbosch" className="hover:text-gray-900 transition-colors">
                  Stellenbosch
                </Link>
              </li>
              <li>
                <Link href="/mortuaries/paarl" className="hover:text-gray-900 transition-colors">
                  Paarl
                </Link>
              </li>
              <li>
                <Link href="/mortuaries/george" className="hover:text-gray-900 transition-colors">
                  George
                </Link>
              </li>
              <li>
                <Link href="/mortuaries/worcester" className="hover:text-gray-900 transition-colors">
                  Worcester
                </Link>
              </li>
              <li>
                <Link href="/mortuaries/hermanus" className="hover:text-gray-900 transition-colors">
                  Hermanus
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Western Cape Mortuary Finder. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
