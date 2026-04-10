# Western Cape Mortuary Finder
## System Architecture Document

**Version:** 1.0 | **Date:** April 2026 | **Status:** Production

---

## 1. Executive Summary

The **Western Cape Mortuary Finder** is a full-stack web platform that helps bereaved families find mortuaries with available space across 10 Western Cape cities.

**What makes it unique:** No app in South Africa — or globally — currently offers real-time mortuary availability to the public.

### Key Numbers

| Metric | Value |
|--------|-------|
| Pages | 12 |
| Components | 32 (10 UI + 22 feature) |
| API Endpoints | 8 |
| Database Tables | 6 |
| Languages | 3 (English, Afrikaans, isiXhosa) |
| Translation Keys | 1,089 (363 per language) |
| Subscription Tiers | 3 (Free / Standard / Premium) |
| Western Cape Cities | 10 |
| Service Categories | 7 |

### The Problem

When someone dies, families face three urgent challenges:
1. **No centralized directory** — no single place to find and compare mortuaries with available space
2. **Paper-based intake** — 30+ minutes of manual paperwork during the worst moment of their lives
3. **Digital divide** — many South Africans rely on basic phones without internet access

### Our Solution

A multilingual web platform with:
- Real-time mortuary availability (families see who has space RIGHT NOW)
- Digital intake form (6-step wizard replaces paper forms)
- SMS/USSD fallback (basic phone users send an SMS to find mortuaries)
- Owner dashboard (mortuaries manage their listing and receive submissions)
- Freemium SaaS model (3 subscription tiers generate revenue)

---

## 2. System Overview

### 2.1 System Context (Who Uses It)

```
                    EXTERNAL ACTORS
    ┌──────────┬──────────┬──────────┬──────────┐
    │  Family  │ Mortuary │   SMS    │  Search  │
    │ (Browser)│  Owner   │ Gateway  │  Engine  │
    │          │(Browser) │(Africa's │ (Google) │
    │          │          │ Talking) │          │
    └────┬─────┴────┬─────┴────┬─────┴────┬─────┘
         │          │          │          │
         ▼          ▼          ▼          ▼
    ┌─────────────────────────────────────────────┐
    │     WESTERN CAPE MORTUARY FINDER            │
    │     Next.js 16 Application on Vercel        │
    └──────┬──────────┬──────────┬────────────────┘
           │          │          │
           ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────────┐
    │ Supabase │ │  Resend  │ │OpenStreetMap │
    │ Database │ │  Email   │ │  Map Tiles   │
    │ + Auth   │ │ Service  │ │   (Free)     │
    └──────────┘ └──────────┘ └──────────────┘
```

**Key insight:** A single Next.js deployment connects to three fully managed services — zero servers to maintain.

### 2.2 Actors

| Actor | What They Do | How They Access |
|-------|-------------|-----------------|
| **Family (Public User)** | Search mortuaries, view availability, submit intake forms, leave reviews | Web browser or SMS |
| **Mortuary Owner** | Register, manage listing, update availability, view submissions | Web browser (authenticated) |
| **SMS Gateway** | Relays SMS queries from basic phone users | HTTP GET to `/api/v1/sms` |
| **Search Engine** | Indexes public pages for Google/Bing discoverability | HTTP GET (sitemap.xml) |
| **Platform Admin** | Approves mortuary listings, manages tiers | Supabase Dashboard (manual) |

---

## 3. Technology Stack

### 3.1 Frontend (18 packages)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.1 | Full-stack React framework (App Router) |
| React | 19.2.4 | UI component library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| shadcn/ui | latest | Accessible UI component library |
| Leaflet | 1.9.4 | Interactive map rendering |
| React Leaflet | 5.0.0 | React bindings for Leaflet |
| Lucide React | 1.7.0 | Icon library (replaces emojis) |
| Sonner | 2.0.7 | Toast notification system |

### 3.2 Backend (6 packages)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Supabase | 2.101.0 | Database + Authentication + Row Level Security |
| PostgreSQL | managed | Relational database (hosted by Supabase) |
| Zod | 4.3.6 | Runtime schema validation |
| Resend | 6.10.0 | Transactional email delivery |

### 3.3 Infrastructure

| Technology | Purpose |
|-----------|---------|
| Vercel | Hosting, CI/CD, edge network, SSL |
| Supabase Cloud | Managed PostgreSQL + Auth |
| GitHub | Source code repository |

### 3.4 Why We Chose This Stack

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Server components for SEO, API routes in one deployment, no separate backend needed |
| **Supabase over custom backend** | Built-in auth, PostgreSQL with RLS, real-time capable — replaces 3 separate services |
| **Leaflet over Google Maps** | Free, open-source, no API key costs — sufficient for a directory use case |
| **Resend over SendGrid** | Developer-friendly API, simple integration, pay-per-email pricing |
| **shadcn/ui** | Accessible, customizable, components are copied into project (no vendor lock-in) |

---

## 4. Application Architecture

### 4.1 Architecture Pattern

The application follows a **monolithic full-stack architecture** — a single Next.js deployment handles both the frontend UI and backend API routes. This is appropriate for the current scale and simplifies deployment.

### 4.2 Rendering Strategy

| Page | Route | Rendering | Why |
|------|-------|-----------|-----|
| Home | `/` | Server Component | SEO, fetches live city stats |
| City Listing | `/mortuaries/[city]` | Server Component | SEO, dynamic mortuary data |
| Mortuary Detail | `/mortuaries/[city]/[slug]` | Server Component | SEO, dynamic detail + metadata |
| Intake Form | `/mortuaries/[city]/[slug]/intake` | Server → Client | Server fetches mortuary, client handles 6-step wizard |
| Pricing | `/pricing` | Client Component | Uses language switcher (useLanguage hook) |
| Privacy & Terms | `/privacy`, `/terms` | Server Component | Static legal content |
| Admin Login | `/admin/login` | Client Component | Interactive form with auth |
| Admin Register | `/admin/register` | Client Component | Interactive form with auth |
| Admin Reset Password | `/admin/reset-password` | Client Component | Interactive form with auth |
| Admin Dashboard | `/admin/dashboard` | Client Component | Real-time data, interactive controls |
| Admin Onboarding | `/admin/onboarding` | Client Component | Complex multi-section form |

**Summary:** 6 Server Components (SEO-optimized) + 6 Client Components (interactive)

### 4.3 Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/v1/                   # 8 REST API endpoints
│   │   ├── cities/               # GET - list cities
│   │   ├── mortuaries/           # GET - list/detail mortuaries
│   │   ├── intake/               # POST - submit intake form
│   │   ├── reviews/              # POST - submit review
│   │   └── sms/                  # GET - SMS/USSD plain text
│   ├── admin/                    # Owner portal (5 pages)
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   ├── dashboard/
│   │   └── onboarding/
│   ├── mortuaries/               # Public directory (3 pages)
│   │   ├── [city]/
│   │   └── [city]/[slug]/
│   │       └── intake/
│   ├── pricing/
│   ├── privacy/
│   ├── terms/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx             # 404 page
│
├── components/                   # 32 reusable components
│   ├── ui/                       # 10 shadcn/ui base components
│   ├── intake/                   # Intake form wizard
│   ├── reviews/                  # Star rating, form, list
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── language-switcher.tsx
│   ├── mortuary-card.tsx
│   ├── contact-buttons.tsx
│   ├── availability-badge.tsx
│   ├── operating-hours.tsx
│   ├── mortuary-map.tsx
│   ├── leaflet-map.tsx
│   └── ...
│
├── lib/                          # Shared utilities
│   ├── i18n/                     # Internationalization (3 languages)
│   │   ├── translations.ts       # 1,089 translation keys
│   │   └── language-context.tsx   # React context + cookie persistence
│   ├── supabase/
│   │   ├── client.ts             # Browser client (reads auth from cookies)
│   │   └── server.ts             # Server client (manages cookie lifecycle)
│   ├── tiers.ts                  # Subscription tier feature gates
│   └── constants.ts              # Cities, services, labels
│
└── types/                        # TypeScript definitions
    ├── mortuary.ts
    ├── intake.ts
    └── api.ts
```

### 4.4 Component Hierarchy

```
RootLayout (layout.tsx)
├── LanguageProvider (i18n context — wraps entire app)
├── SiteHeader
│   └── LanguageSwitcher (EN / AF / XH dropdown)
├── [Page Content]
│   ├── HomePage
│   │   └── HomeContent → CityCards (live availability counts)
│   ├── CityPage
│   │   ├── ServiceFilter (filter by service type)
│   │   ├── SortSelect (sort by name/availability/price)
│   │   ├── MortuaryCard[] (list of mortuaries)
│   │   └── MortuaryMap → LeafletMap (standard+ tier only)
│   ├── MortuaryDetailPage
│   │   ├── AvailabilityBadge (green/amber/red)
│   │   ├── PriceBadge (budget/mid-range/premium)
│   │   ├── VerifiedPartnerBadge (premium only)
│   │   ├── ContactButtons (Call / WhatsApp / Directions)
│   │   ├── ServiceTags
│   │   ├── OperatingHours (status + full schedule)
│   │   ├── ShareButton
│   │   ├── ViewTracker (anonymous view counting)
│   │   ├── ReviewList → StarRating
│   │   └── ReviewForm → StarRating
│   ├── IntakePage
│   │   └── IntakeWizard (6 steps)
│   │       Step 1: Deceased Info
│   │       Step 2: Death Details
│   │       Step 3: Doctor Details
│   │       Step 4: Next-of-Kin
│   │       Step 5: Preferences (burial/cremation/religion)
│   │       Step 6: Insurance + Notes
│   └── AdminDashboard
│       ├── Plan Feature Checklist (14 features)
│       ├── Stats Cards (views / contacts / submissions)
│       ├── Availability Updater (radio buttons)
│       └── Intake Submissions List (expandable cards)
├── SiteFooter
└── Toaster (toast notifications)
```

---

## 5. Database Design

### 5.1 Entity-Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   auth.users     │         │     cities       │
│   (Supabase)     │         │                  │
├─────────────────┤         ├─────────────────┤
│ id (UUID) PK     │         │ id (UUID) PK     │
│ email            │         │ name             │
│ password (hash)  │         │ slug (UNIQUE)    │
└────────┬────────┘         │ province         │
         │                   └────────┬────────┘
         │ owner_id (FK)              │ city_id (FK)
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────┐
│                    mortuaries                        │
│                  (Central Entity)                    │
├─────────────────────────────────────────────────────┤
│ id (UUID) PK                                         │
│ owner_id (FK → auth.users)                           │
│ name, slug (UNIQUE), description                     │
│ address, city_id (FK → cities)                       │
│ phone, whatsapp, email                               │
│ latitude, longitude                                  │
│ availability (available | limited | full)  CHECK     │
│ price_range (budget | mid-range | premium) CHECK     │
│ subscription_tier (free | standard | premium) CHECK  │
│ is_featured, verified_partner                        │
│ is_active, is_approved                               │
│ view_count, contact_clicks                           │
│ created_at, updated_at (auto-trigger)                │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
       │ 1:N          │ 1:N          │ 1:N
       ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│mortuary_     │ │mortuary_     │ │              │
│  services    │ │  hours       │ │   reviews    │
├──────────────┤ ├──────────────┤ ├──────────────┤
│id (UUID) PK  │ │id (UUID) PK  │ │id (UUID) PK  │
│mortuary_id FK│ │mortuary_id FK│ │mortuary_id FK│
│service_name  │ │day_of_week   │ │reviewer_name │
│              │ │  (0-6)       │ │reviewer_phone│
│              │ │open_time     │ │rating (1-5)  │
│              │ │close_time    │ │comment       │
│              │ │is_closed     │ │is_approved   │
│              │ │UNIQUE(mort,  │ │created_at    │
│              │ │  day)        │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
                                          │
       ┌──────────────────────────────────┘
       │ 1:N (mortuary_id)
       ▼
┌─────────────────────────────┐
│     intake_submissions       │
├─────────────────────────────┤
│ id (UUID) PK                 │
│ mortuary_id (FK)             │
│ status (new | in-progress |  │
│   completed | cancelled)     │
│                              │
│ -- Deceased (7 fields) --    │
│ full_name, id_number,        │
│ date_of_birth, date_of_death,│
│ gender, address,             │
│ marital_status, spouse_name  │
│                              │
│ -- Death Details (4 fields)--│
│ death_scenario, location,    │
│ hospital_name, saps_case     │
│                              │
│ -- Doctor (3 fields) --      │
│ name, practice_number, phone │
│                              │
│ -- Next-of-Kin (6 fields) -- │
│ name, id, relationship,      │
│ phone, email, address        │
│                              │
│ -- Preferences (4 fields) -- │
│ disposition, religion,       │
│ cultural_requirements,       │
│ urgent_burial                │
│                              │
│ -- Insurance (3 fields) --   │
│ has_policy, provider,        │
│ policy_number                │
│                              │
│ additional_notes             │
│ created_at, updated_at       │
└─────────────────────────────┘
```

### 5.2 Table Summary

| Table | Rows (Est.) | Purpose | Relationships |
|-------|------------|---------|---------------|
| **cities** | 10 (fixed) | Western Cape city reference | 1:N → mortuaries |
| **mortuaries** | 10-100 | Core entity — mortuary listings | N:1 ← cities, 1:N → services, hours, reviews, submissions |
| **mortuary_services** | 50-700 | Services per mortuary (cold storage, embalming, etc.) | N:1 ← mortuaries |
| **mortuary_hours** | 70-700 | Operating hours (7 days per mortuary) | N:1 ← mortuaries |
| **intake_submissions** | Growing | Digital intake forms from families | N:1 ← mortuaries |
| **reviews** | Growing | Star ratings and comments from families | N:1 ← mortuaries |

### 5.3 Database Features

| Feature | Count | Details |
|---------|-------|---------|
| **Indexes** | 14 | On slugs, city_id, availability, tier, status, created_at |
| **CHECK Constraints** | 5 | availability, price_range, subscription_tier, gender, status |
| **Auto-Update Triggers** | 2 | `updated_at = NOW()` on mortuaries and intake_submissions |
| **RLS Policies** | 18 | Row Level Security on all 6 tables |
| **Foreign Keys** | 6 | All with CASCADE DELETE |

---

## 6. Security Architecture

### 6.1 Five-Layer Defense Model

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: NETWORK (Vercel Edge)                          │
│   HTTPS enforced (TLS 1.3) · DDoS protection            │
│   Edge caching for static assets · SSL termination       │
├─────────────────────────────────────────────────────────┤
│ Layer 2: APPLICATION (Next.js)                          │
│   Input validation (Zod schemas) · CSRF (SameSite)      │
│   XSS prevention (React auto-escaping)                  │
│   Service role key: server-only (never in browser)      │
├─────────────────────────────────────────────────────────┤
│ Layer 3: AUTHENTICATION (Supabase Auth)                 │
│   JWT-based session tokens · Secure cookie storage      │
│   Password hashing (bcrypt) · Email verification        │
├─────────────────────────────────────────────────────────┤
│ Layer 4: AUTHORIZATION (PostgreSQL RLS)                 │
│   Row Level Security on ALL 6 tables                    │
│   auth.uid() ownership checks · Deny-by-default         │
│   Owners can ONLY see/edit their own data               │
├─────────────────────────────────────────────────────────┤
│ Layer 5: DATA (PostgreSQL)                              │
│   CHECK constraints on enums · NOT NULL on required     │
│   UNIQUE on slugs · Foreign key cascading deletes       │
└─────────────────────────────────────────────────────────┘
```

### 6.2 RLS Access Matrix

Authorization is enforced at the **database level**, not the application level. Even if a bug in the API leaked a query, PostgreSQL itself blocks unauthorized access.

| Table | Public (Anonymous) | Authenticated Owner | Service Role |
|-------|-------------------|-------------------|-------------|
| **cities** | SELECT | SELECT | Full |
| **mortuaries** | SELECT (active + approved only) | SELECT / INSERT / UPDATE (own only) | Full |
| **mortuary_services** | SELECT (active parent only) | INSERT / SELECT / DELETE (own) | Full |
| **mortuary_hours** | SELECT (active parent only) | Full CRUD (own) | Full |
| **intake_submissions** | INSERT only | SELECT / UPDATE (own mortuary) | Full |
| **reviews** | INSERT + SELECT (approved only) | SELECT / UPDATE (own mortuary) | Full |

**Service Role Key** bypasses RLS and is only used server-side in 3 API routes: `POST /intake`, `POST /reviews`, `GET /sms`. It is **never exposed to the browser**.

### 6.3 Authentication Flow

```
Owner                 Next.js Client        Supabase Auth        PostgreSQL (RLS)
  │                        │                      │                      │
  │  Email + Password      │                      │                      │
  │───────────────────────>│                      │                      │
  │                        │  signInWithPassword() │                      │
  │                        │─────────────────────>│                      │
  │                        │                      │  Validate            │
  │                        │    JWT + Session      │  credentials         │
  │                        │<─────────────────────│                      │
  │                        │                      │                      │
  │  Load /admin/dashboard │                      │                      │
  │───────────────────────>│                      │                      │
  │                        │  Query with JWT       │                      │
  │                        │  (Authorization       │                      │
  │                        │   header)             │                      │
  │                        │─────────────────────────────────────────────>│
  │                        │                      │  RLS checks          │
  │                        │                      │  auth.uid() =        │
  │                        │     Filtered data     │  owner_id            │
  │                        │<─────────────────────────────────────────────│
  │  Render dashboard      │                      │                      │
  │<───────────────────────│                      │                      │
```

### 6.4 Threat Mitigations

| Threat | Mitigation |
|--------|-----------|
| **SQL Injection** | Supabase SDK uses parameterized queries |
| **XSS** | React auto-escapes all JSX output; no `dangerouslySetInnerHTML` |
| **CSRF** | SameSite cookie attribute; Supabase PKCE auth flow |
| **Data Exposure** | RLS ensures owners only see their own data |
| **Service Role Leak** | Key only used server-side in API routes (never `NEXT_PUBLIC_`) |
| **Intake Data Privacy** | Sensitive personal data protected by RLS; only mortuary owner can read |
| **Review Spam** | Reviews require `is_approved` flag; owner moderation |
| **View Count Gaming** | Cookie-based deduplication prevents repeated view inflation |
| **POPIA Compliance** | SA privacy law aligned; Privacy Policy published at `/privacy` |

### 6.5 Environment Variables

| Variable | Exposure | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (client-safe) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (client-safe) | Anonymous key (RLS-restricted) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only (secret)** | Bypasses RLS for admin operations |
| `RESEND_API_KEY` | **Server-only (secret)** | Email sending authorization |

---

## 7. API Design

### 7.1 Endpoint Reference

All API endpoints are versioned under `/api/v1/` and follow REST conventions.

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/v1/cities` | List all 10 Western Cape cities | None | `City[]` |
| GET | `/api/v1/mortuaries?city={slug}` | List mortuaries by city | None | `Mortuary[]` |
| GET | `/api/v1/mortuaries/{slug}` | Get single mortuary with details | None | `MortuaryWithDetails` |
| POST | `/api/v1/mortuaries/{slug}/track-view` | Increment view count (deduplicated) | None | `{ success: true }` |
| POST | `/api/v1/mortuaries/{slug}/track-contact` | Increment contact click count | None | `{ success: true }` |
| POST | `/api/v1/intake` | Submit digital intake form (27 fields) | None | `{ id, status }` |
| POST | `/api/v1/reviews` | Submit star rating + review | None | `{ id }` |
| GET | `/api/v1/sms?city={name}` | SMS/USSD gateway (plain text) | None | `text/plain` |

### 7.2 SMS/USSD Flow (Bridging the Digital Divide)

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  User    │    │ SMS Gateway  │    │   Next.js    │    │ Supabase │
│ (Phone)  │    │ (Africa's    │    │ /api/v1/sms  │    │          │
│          │    │  Talking)    │    │              │    │          │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └────┬─────┘
     │                 │                    │                  │
     │ SMS "Cape Town" │                    │                  │
     │────────────────>│                    │                  │
     │                 │ GET /api/v1/sms    │                  │
     │                 │ ?city=cape+town    │                  │
     │                 │───────────────────>│                  │
     │                 │                    │ Query mortuaries │
     │                 │                    │─────────────────>│
     │                 │                    │     Results      │
     │                 │                    │<─────────────────│
     │                 │  Plain text list   │                  │
     │                 │<───────────────────│                  │
     │ SMS response    │                    │                  │
     │<────────────────│                    │                  │
```

**SMS Response Example:**
```
Mortuaries in Cape Town:

[OPEN] Peninsula Funerals
Call: +27219489490

[OPEN] Atlantic Funeral Services
Call: +27215933708

[LIMITED] Doves Funeral Services
Call: +27214471150

More info: western-cape-mortuary-finder.vercel.app
```

---

## 8. Subscription Tiers

### 8.1 Feature Matrix

| Feature | Free (R0) | Standard (R299/mo) | Premium (R599/mo) |
|---------|-----------|-------------------|-------------------|
| Listed on platform | Yes | Yes | Yes |
| Name, address, phone | Yes | Yes | Yes |
| **Availability status** | **Yes** | Yes | Yes |
| Services & operating hours | - | Yes | Yes |
| WhatsApp button | - | Yes | Yes |
| Receive intake form submissions | - | Yes | Yes |
| Price range badge | - | Yes | Yes |
| View & contact analytics | - | Yes | Yes |
| Map pin on city page | - | Yes | Yes |
| Receive reviews & ratings | - | - | Yes |
| Email notifications on intake | - | - | Yes |
| Verified Partner badge | - | - | Yes |
| Priority placement (listed first) | - | - | Yes |
| Featured on homepage | - | - | Yes |

### 8.2 How Tiers Are Enforced

Tier restrictions are enforced in the **frontend rendering layer** using the `hasFeature(tier, feature)` utility:

- **Detail page:** Features are conditionally shown/hidden based on the mortuary's `subscription_tier`
- **City listing:** Premium mortuaries are always sorted first (priority placement)
- **Map:** Only standard+ mortuaries appear on the map
- **Dashboard:** Owners see a checklist of active vs locked features with an upgrade link

Tier changes are currently **manual** (updated in Supabase). Future: Yoco/PayFast payment integration.

---

## 9. Internationalization (i18n)

### 9.1 Language Support

| Language | Code | Status | Coverage |
|----------|------|--------|----------|
| English | `en` | Complete | All 12 pages, all components |
| Afrikaans | `af` | Complete | All 12 pages, all components |
| isiXhosa | `xh` | Complete | All 12 pages, all components |

**Total: 1,089 translation keys (363 per language)**

### 9.2 How It Works

```
LanguageProvider (React Context)
│
├── useLanguage() hook → returns { locale, setLocale, t() }
│
└── translations.ts
    ├── en: { "header.brand": "WC Mortuary Finder", ... }  363 keys
    ├── af: { "header.brand": "WK Begrafnisplaas Soeker", ... }  363 keys
    └── xh: { "header.brand": "Umfumani Wendawo...", ... }  363 keys
```

- **Switcher:** Custom dropdown in header (Globe icon → EN/AF/XH)
- **Persistence:** Language preference saved in browser cookie (survives page refresh)
- **Function:** `t("key.path")` returns the localized string for the current language

---

## 10. Deployment Architecture

### 10.1 Infrastructure

```
┌─────────────────────────────────────────────┐
│           VERCEL PLATFORM                    │
│                                              │
│  ┌────────────────────────────────────┐      │
│  │         EDGE NETWORK (CDN)         │      │
│  │  Static assets · Cached pages      │      │
│  │  SSL termination · DDoS protection │      │
│  └──────────────┬─────────────────────┘      │
│                 │                             │
│  ┌──────────────┴─────────────────────┐      │
│  │      SERVERLESS FUNCTIONS          │      │
│  │  Server Components (page render)   │      │
│  │  API Routes (/api/v1/*)            │      │
│  │  Auto-scaling (0 → N instances)    │      │
│  └──────────────┬─────────────────────┘      │
│                 │                             │
└─────────────────┼─────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌────────┐  ┌──────────────┐
│Supabase│  │ Resend │  │OpenStreetMap │
│ Cloud  │  │  API   │  │ Tile Server  │
│        │  │        │  │              │
│ Auth   │  │ Send   │  │ Map tiles    │
│ DB     │  │ intake │  │ (free)       │
│ RLS    │  │ emails │  │              │
└────────┘  └────────┘  └──────────────┘
```

### 10.2 CI/CD Pipeline

```
Developer → git push → GitHub → Vercel Build → Deploy
                                    │
                           ├── Preview (PR branches) → *.vercel.app
                           └── Production (main branch) → western-cape-mortuary-finder.vercel.app
```

### 10.3 Environments

| Environment | Trigger | Domain |
|-------------|---------|--------|
| **Production** | Push to `main` | `western-cape-mortuary-finder.vercel.app` |
| **Preview** | Pull request | `*.vercel.app` (auto-generated) |
| **Development** | Local | `localhost:3000` |

### 10.4 Scalability

| Dimension | Current | Scaling Path |
|-----------|---------|-------------|
| **Compute** | Vercel serverless (auto) | No action needed — scales to demand |
| **Database** | Supabase free/pro tier | Upgrade plan; add read replicas |
| **Cities** | 10 (hardcoded constant) | Add to `cities` table + update constants |
| **Mortuaries** | ~100 expected | Database handles thousands; add pagination |
| **Real-time** | Not yet implemented | Supabase Realtime for live availability |

### 10.5 Estimated Load

| Metric | Estimate |
|--------|----------|
| Monthly active users | 500 – 5,000 |
| Page views/month | 5,000 – 50,000 |
| Intake submissions/month | 50 – 500 |
| API calls/month | 10,000 – 100,000 |
| Database size | < 1 GB |

---

## 11. Data Flows

### 11.1 Family Searches for Mortuary

```
Browser                    Next.js Server              Supabase
  │                            │                          │
  │ GET /mortuaries/cape-town  │                          │
  │───────────────────────────>│                          │
  │                            │ SELECT mortuaries        │
  │                            │ WHERE city.slug =        │
  │                            │ 'cape-town'              │
  │                            │ AND is_active = true     │
  │                            │ AND is_approved = true   │
  │                            │─────────────────────────>│
  │                            │        Rows[]            │
  │                            │<─────────────────────────│
  │  Server-rendered HTML      │                          │
  │<───────────────────────────│                          │
  │                            │                          │
  │ POST /track-view (client)  │                          │
  │───────────────────────────>│ UPDATE view_count + 1    │
  │                            │─────────────────────────>│
  │ (cookie set for dedup)     │                          │
  │<───────────────────────────│                          │
```

### 11.2 Family Submits Intake Form

```
Browser              API Route             Supabase           Resend
  │                      │                     │                 │
  │ POST /api/v1/intake  │                     │                 │
  │ { deceased_name,     │                     │                 │
  │   nok_phone, ... }   │                     │                 │
  │─────────────────────>│                     │                 │
  │                      │ Validate fields     │                 │
  │                      │ Verify mortuary     │                 │
  │                      │ exists & is active  │                 │
  │                      │────────────────────>│                 │
  │                      │    Found            │                 │
  │                      │<────────────────────│                 │
  │                      │                     │                 │
  │                      │ INSERT intake_      │                 │
  │                      │ submissions         │                 │
  │                      │────────────────────>│                 │
  │                      │    { id }           │                 │
  │                      │<────────────────────│                 │
  │                      │                     │                 │
  │                      │ Send email          │                 │
  │                      │ notification        │                 │
  │                      │ (non-blocking)      │                 │
  │                      │────────────────────────────────────>│
  │                      │                     │                 │
  │ { id, status:        │                     │                 │
  │   "submitted" }      │                     │                 │
  │<─────────────────────│                     │                 │
```

---

## 12. Protected Routes

| Route | Protection | Redirect on Failure |
|-------|-----------|-------------------|
| `/admin/dashboard` | Client-side auth check (`getUser()`) | → `/admin/login` |
| `/admin/onboarding` | Client-side auth check (`getUser()`) | → `/admin/login` |
| `/admin/login` | Public | — |
| `/admin/register` | Public | — |
| `/admin/reset-password` | Public | — |
| All public routes | Public | — |

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Intake Form** | Digital pre-registration form for deceased person details, submitted by next-of-kin |
| **NOK** | Next of Kin — the family member managing funeral arrangements |
| **RLS** | Row Level Security — PostgreSQL feature restricting data access per row |
| **SAPS** | South African Police Service — case number required for unnatural deaths |
| **POPIA** | Protection of Personal Information Act — South Africa's data privacy law |
| **USSD** | Unstructured Supplementary Service Data — mobile protocol for feature-phone access |
| **Service Role** | Supabase admin key that bypasses RLS — used server-side only |
| **Slug** | URL-friendly identifier (e.g., `cape-town`, `sunrise-mortuary`) |
| **Subscription Tier** | Feature access level for mortuary owners (Free / Standard / Premium) |
| **Verified Partner** | Badge indicating a vetted, trusted mortuary operator (Premium tier) |
| **DHA-1663** | South African Death Notification Form — the key document in the death registration process |

---

*Document generated from codebase analysis on 2026-04-09.*
*Live URL: https://western-cape-mortuary-finder.vercel.app*
*Repository: https://github.com/Sabelo-Duma/western-cape-mortuary-finder*
