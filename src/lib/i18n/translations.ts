export type Locale = "en" | "af" | "xh";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  af: "Afrikaans",
  xh: "isiXhosa",
};

export const DEFAULT_LOCALE: Locale = "en";

const translations = {
  en: {
    // Header
    "header.brand": "WC Mortuary Finder",
    "header.findMortuary": "Find a Mortuary",
    "header.ownerPortal": "Owner Portal",

    // Hero
    "hero.title": "Find a Mortuary",
    "hero.titleHighlight": "in the Western Cape",
    "hero.subtitle":
      "Quickly find mortuaries with available space. View services, hours, and contact them directly — all in one place.",
    "hero.cities": "Cities",
    "hero.availableNow": "Available Now",
    "hero.mortuaries": "Mortuaries",

    // City grid
    "cityGrid.title": "Select your city",
    "cityGrid.subtitle":
      "Green means mortuaries with space are available in that city",
    "cityGrid.available": "available",
    "cityGrid.limited": "limited",
    "cityGrid.allFull": "All full",
    "cityGrid.noMortuaries": "No mortuaries yet",

    // Features
    "feature.availability": "Real-Time Availability",
    "feature.availabilityDesc":
      "See which mortuaries have space right now — no phone calls needed.",
    "feature.contact": "One-Tap Contact",
    "feature.contactDesc":
      "Call or WhatsApp a mortuary directly from the listing page.",
    "feature.verified": "Verified Listings",
    "feature.verifiedDesc":
      "All mortuaries are reviewed before appearing on the platform.",

    // City page
    "city.mortuariesIn": "Mortuaries in",
    "city.backToSearch": "Back to city search",
    "city.noMortuaries": "No mortuaries listed in this city yet.",
    "city.noMortuariesSub":
      "Are you a mortuary owner? Register to list your mortuary here.",
    "city.registerMortuary": "Register Your Mortuary",
    "city.filterByService": "Filter by service",
    "city.clearFilters": "Clear filters",

    // Availability
    "availability.available": "Available",
    "availability.limited": "Limited Space",
    "availability.full": "Full",

    // Price range
    "price.budget": "Budget",
    "price.midRange": "Mid-range",
    "price.premium": "Premium",

    // Services
    "service.coldStorage": "Cold Storage",
    "service.embalming": "Embalming",
    "service.viewingRoom": "Viewing Room",
    "service.chapel": "Chapel",
    "service.cremation": "Cremation",
    "service.bodyCollection": "Body Collection",
    "service.refrigeration": "Refrigeration",

    // Contact
    "contact.call": "Call",
    "contact.whatsapp": "WhatsApp",
    "contact.directions": "Get Directions",

    // Detail page
    "detail.backToCity": "Back to",
    "detail.services": "Services Offered",
    "detail.about": "About",
    "detail.operatingHours": "Operating Hours",
    "detail.share": "Share",
    "detail.linkCopied": "Link copied!",

    // Operating hours
    "hours.sunday": "Sunday",
    "hours.monday": "Monday",
    "hours.tuesday": "Tuesday",
    "hours.wednesday": "Wednesday",
    "hours.thursday": "Thursday",
    "hours.friday": "Friday",
    "hours.saturday": "Saturday",
    "hours.closed": "Closed",
    "hours.openNow": "Open now",
    "hours.closesAt": "Closes at",
    "hours.closedNow": "Closed",
    "hours.opensOn": "Opens",
    "hours.today": "today at",

    // Footer
    "footer.description":
      "Helping bereaved families in the Western Cape find mortuaries with available space, quickly and with dignity.",
    "footer.quickLinks": "Quick Links",
    "footer.registerMortuary": "Register Your Mortuary",
    "footer.ownerLogin": "Owner Login",
    "footer.cities": "Western Cape Cities",
    "footer.rights": "All rights reserved.",

    // 404
    "notFound.title": "Page not found",
    "notFound.message":
      "Sorry, we couldn't find the page you're looking for.",
    "notFound.backHome": "Go back home",

    // Error
    "error.title": "Something went wrong",
    "error.message":
      "We're sorry, an unexpected error occurred. Please try again.",
    "error.tryAgain": "Try again",

    // Admin
    "admin.login": "Owner Login",
    "admin.register": "Register",
    "admin.email": "Email",
    "admin.password": "Password",
    "admin.signIn": "Sign In",
    "admin.signUp": "Create Account",
    "admin.noAccount": "Don't have an account?",
    "admin.hasAccount": "Already have an account?",
  },

  af: {
    // Header
    "header.brand": "WK Begrafnisplaas Soeker",
    "header.findMortuary": "Vind 'n Begrafnisplaas",
    "header.ownerPortal": "Eienaar Portaal",

    // Hero
    "hero.title": "Vind 'n Begrafnisplaas",
    "hero.titleHighlight": "in die Wes-Kaap",
    "hero.subtitle":
      "Vind vinnig begrafnisplase met beskikbare ruimte. Sien dienste, ure, en kontak hulle direk — alles op een plek.",
    "hero.cities": "Stede",
    "hero.availableNow": "Nou Beskikbaar",
    "hero.mortuaries": "Begrafnisplase",

    // City grid
    "cityGrid.title": "Kies jou stad",
    "cityGrid.subtitle":
      "Groen beteken daar is begrafnisplase met ruimte beskikbaar in daardie stad",
    "cityGrid.available": "beskikbaar",
    "cityGrid.limited": "beperk",
    "cityGrid.allFull": "Almal vol",
    "cityGrid.noMortuaries": "Nog geen begrafnisplase nie",

    // Features
    "feature.availability": "Intydse Beskikbaarheid",
    "feature.availabilityDesc":
      "Sien watter begrafnisplase nou ruimte het — geen oproepe nodig nie.",
    "feature.contact": "Een-Tik Kontak",
    "feature.contactDesc":
      "Bel of WhatsApp 'n begrafnisplaas direk vanaf die lys.",
    "feature.verified": "Geverifieerde Lyste",
    "feature.verifiedDesc":
      "Alle begrafnisplase word nagegaan voordat hulle op die platform verskyn.",

    // City page
    "city.mortuariesIn": "Begrafnisplase in",
    "city.backToSearch": "Terug na stad soek",
    "city.noMortuaries": "Geen begrafnisplase in hierdie stad gelys nie.",
    "city.noMortuariesSub":
      "Is jy 'n begrafnisplaas eienaar? Registreer om jou begrafnisplaas hier te lys.",
    "city.registerMortuary": "Registreer Jou Begrafnisplaas",
    "city.filterByService": "Filter volgens diens",
    "city.clearFilters": "Verwyder filters",

    // Availability
    "availability.available": "Beskikbaar",
    "availability.limited": "Beperkte Ruimte",
    "availability.full": "Vol",

    // Price range
    "price.budget": "Bekostigbaar",
    "price.midRange": "Middelslag",
    "price.premium": "Premie",

    // Services
    "service.coldStorage": "Koue Berging",
    "service.embalming": "Balsem",
    "service.viewingRoom": "Besigtigingskamer",
    "service.chapel": "Kapel",
    "service.cremation": "Verassing",
    "service.bodyCollection": "Liggaam Versameling",
    "service.refrigeration": "Verkoeling",

    // Contact
    "contact.call": "Bel",
    "contact.whatsapp": "WhatsApp",
    "contact.directions": "Kry Aanwysings",

    // Detail page
    "detail.backToCity": "Terug na",
    "detail.services": "Dienste Aangebied",
    "detail.about": "Oor",
    "detail.operatingHours": "Bedryfsure",
    "detail.share": "Deel",
    "detail.linkCopied": "Skakel gekopieer!",

    // Operating hours
    "hours.sunday": "Sondag",
    "hours.monday": "Maandag",
    "hours.tuesday": "Dinsdag",
    "hours.wednesday": "Woensdag",
    "hours.thursday": "Donderdag",
    "hours.friday": "Vrydag",
    "hours.saturday": "Saterdag",
    "hours.closed": "Gesluit",
    "hours.openNow": "Nou oop",
    "hours.closesAt": "Sluit om",
    "hours.closedNow": "Gesluit",
    "hours.opensOn": "Open",
    "hours.today": "vandag om",

    // Footer
    "footer.description":
      "Help bedroefde gesinne in die Wes-Kaap om begrafnisplase met beskikbare ruimte vinnig en met waardigheid te vind.",
    "footer.quickLinks": "Vinnige Skakels",
    "footer.registerMortuary": "Registreer Jou Begrafnisplaas",
    "footer.ownerLogin": "Eienaar Aanmelding",
    "footer.cities": "Wes-Kaap Stede",
    "footer.rights": "Alle regte voorbehou.",

    // 404
    "notFound.title": "Bladsy nie gevind nie",
    "notFound.message":
      "Jammer, ons kon nie die bladsy vind waarna jy soek nie.",
    "notFound.backHome": "Gaan terug huis toe",

    // Error
    "error.title": "Iets het fout gegaan",
    "error.message":
      "Ons is jammer, 'n onverwagte fout het voorgekom. Probeer asseblief weer.",
    "error.tryAgain": "Probeer weer",

    // Admin
    "admin.login": "Eienaar Aanmelding",
    "admin.register": "Registreer",
    "admin.email": "E-pos",
    "admin.password": "Wagwoord",
    "admin.signIn": "Meld Aan",
    "admin.signUp": "Skep Rekening",
    "admin.noAccount": "Het jy nie 'n rekening nie?",
    "admin.hasAccount": "Het jy reeds 'n rekening?",
  },

  xh: {
    // Header
    "header.brand": "Umfumani Wendawo Yokugcina Izidumbu eNtshona Koloni",
    "header.findMortuary": "Fumana Indawo Yokugcina Izidumbu",
    "header.ownerPortal": "Indawo Yomnini",

    // Hero
    "hero.title": "Fumana Indawo Yokugcina Izidumbu",
    "hero.titleHighlight": "eNtshona Koloni",
    "hero.subtitle":
      "Fumana ngokukhawuleza iindawo zokugcina izidumbu ezinendawo. Jonga iinkonzo, iiyure, kwaye uqhagamshelane nazo ngqo — konke kwindawo enye.",
    "hero.cities": "Izixeko",
    "hero.availableNow": "Ziyafumaneka Ngoku",
    "hero.mortuaries": "Iindawo Zokugcina Izidumbu",

    // City grid
    "cityGrid.title": "Khetha isixeko sakho",
    "cityGrid.subtitle":
      "Oluluhlaza luthetha ukuba kukho iindawo zokugcina izidumbu ezinendawo kweso sixeko",
    "cityGrid.available": "iyafumaneka",
    "cityGrid.limited": "iyalinganiselwa",
    "cityGrid.allFull": "Zonke zigcwele",
    "cityGrid.noMortuaries": "Akukho ndawo yokugcina izidumbu okwangoku",

    // Features
    "feature.availability": "Ukufumaneka Kwangoku",
    "feature.availabilityDesc":
      "Bona ukuba zeziphi iindawo zokugcina izidumbu ezinendawo ngoku — akukho mfuneko yokufowuna.",
    "feature.contact": "Qhagamshelana Ngokucofa Kanye",
    "feature.contactDesc":
      "Fowunela okanye thumela WhatsApp kwindawo yokugcina izidumbu ngqo ukusuka kwiphepha loluhlu.",
    "feature.verified": "Uluhlu Oluqinisekisiweyo",
    "feature.verifiedDesc":
      "Zonke iindawo zokugcina izidumbu ziyahlolwa phambi kokuba zivele kule platform.",

    // City page
    "city.mortuariesIn": "Iindawo zokugcina izidumbu e",
    "city.backToSearch": "Buyela ekukhangeleni isixeko",
    "city.noMortuaries":
      "Akukho ndawo yokugcina izidumbu edwelisiweyo kwesi sixeko okwangoku.",
    "city.noMortuariesSub":
      "Ungumnini wendawo yokugcina izidumbu? Bhalisa ukudwelisa indawo yakho yokugcina izidumbu apha.",
    "city.registerMortuary": "Bhalisa Indawo Yakho Yokugcina Izidumbu",
    "city.filterByService": "Hluza ngenkonzo",
    "city.clearFilters": "Susa izihluzi",

    // Availability
    "availability.available": "Iyafumaneka",
    "availability.limited": "Indawo Elinganiselweyo",
    "availability.full": "Igcwele",

    // Price range
    "price.budget": "Ixabiso Eliphantsi",
    "price.midRange": "Ixabiso Eliphakathi",
    "price.premium": "Ixabiso Eliphezulu",

    // Services
    "service.coldStorage": "Ugcino Olubandayo",
    "service.embalming": "Ukubalselwa",
    "service.viewingRoom": "Igumbi Lokubonisa",
    "service.chapel": "Itshapeli",
    "service.cremation": "Ukutshiswa",
    "service.bodyCollection": "Ukuthathwa Komzimba",
    "service.refrigeration": "Ukufrijiweyo",

    // Contact
    "contact.call": "Fowunela",
    "contact.whatsapp": "WhatsApp",
    "contact.directions": "Fumana Indlela",

    // Detail page
    "detail.backToCity": "Buyela ku",
    "detail.services": "Iinkonzo Ezinikezelwayo",
    "detail.about": "Malunga ne",
    "detail.operatingHours": "Iiyure Zokusebenza",
    "detail.share": "Yabelana",
    "detail.linkCopied": "Ikhonkco likopishiwe!",

    // Operating hours
    "hours.sunday": "ICawe",
    "hours.monday": "UMvulo",
    "hours.tuesday": "ULwesibini",
    "hours.wednesday": "ULwesithathu",
    "hours.thursday": "ULwesine",
    "hours.friday": "ULwesihlanu",
    "hours.saturday": "UMgqibelo",
    "hours.closed": "Ivaliwe",
    "hours.openNow": "Ivuliwe ngoku",
    "hours.closesAt": "Ivala ngo",
    "hours.closedNow": "Ivaliwe",
    "hours.opensOn": "Ivula",
    "hours.today": "namhlanje ngo",

    // Footer
    "footer.description":
      "Sinceda iintsapho ezisentlungwini eNtshona Koloni ukufumana iindawo zokugcina izidumbu ezinendawo, ngokukhawuleza nangentlonipho.",
    "footer.quickLinks": "Amakhonkco Akhawulezayo",
    "footer.registerMortuary": "Bhalisa Indawo Yakho Yokugcina Izidumbu",
    "footer.ownerLogin": "Ukungena Komnini",
    "footer.cities": "Izixeko ZaseNtshona Koloni",
    "footer.rights": "Onke amalungelo agciniwe.",

    // 404
    "notFound.title": "Iphepha alifumanekanga",
    "notFound.message":
      "Siyaxolisa, asikwazanga ukufumana iphepha olikhangeleyo.",
    "notFound.backHome": "Buyela ekhaya",

    // Error
    "error.title": "Kukho into engahambanga kakuhle",
    "error.message":
      "Siyaxolisa, kwenzeke imposiso engalindelekanga. Nceda uzame kwakhona.",
    "error.tryAgain": "Zama kwakhona",

    // Admin
    "admin.login": "Ukungena Komnini",
    "admin.register": "Bhalisa",
    "admin.email": "I-imeyile",
    "admin.password": "Iphasiwedi",
    "admin.signIn": "Ngena",
    "admin.signUp": "Yenza iAkhawunti",
    "admin.noAccount": "Awunayo iakhawunti?",
    "admin.hasAccount": "Sele unayo iakhawunti?",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.en[key] || key;
}
