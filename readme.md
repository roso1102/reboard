

You are a senior full-stack product designer and React engineer.

Build a clean, modern, professional web interface for a platform called:

"E-Grade – Electronic Asset Recovery & Circular Exchange Platform"

The platform has TWO MODES:

1. Internal Institutional Mode (B2B Asset Recovery Tool)
2. Marketplace Mode (Buyer + Seller)

Design this as a full web app using:

* React (functional components)
* Tailwind CSS
* Clean minimal aesthetic
* Soft shadows
* 2xl rounded cards
* Clear typography hierarchy
* No clutter
* Light theme default
* Professional SaaS dashboard look

The UI must be intuitive, modern, and minimal.

Do NOT make it look like an e-commerce site.
It must look like an industrial SaaS platform.

---

# 🔵 STRUCTURE OF THE WEB APP

Create the following main sections:

## 1️⃣ Landing Page

Clean hero section with:

Headline:
"Prevent Functional Electronics from Becoming Waste"

Subheadline:
"Graded Functional Valuation & Circular Allocation for Electronic Components"

Two buttons:

* "Institution Login"
* "Marketplace"

Minimal illustration section (placeholder space)
Feature highlight cards:

* Automated Layered Testing
* Reusability Scoring
* Verified Certification
* Smart Matching Engine

Footer:

* About
* Contact
* Terms
* Sustainability Report

---

# 🔵 2️⃣ INSTITUTION DASHBOARD (Internal Asset Recovery Mode)

This dashboard is for colleges, labs, startups.

Sidebar Navigation:

* Dashboard Overview
* Test New Component
* Inventory
* Analytics
* Settings

---

## Dashboard Overview Page

Show KPI cards:

* Total Components Tested
* Recovered Value (₹)
* Reusability Rate (%)
* Scrap Reduction (%)

Below that:
Graph:
Monthly recovery trend

Pie chart:
Failure types distribution

---

## Test New Component Page

Form with:

* Component Type (dropdown)
* SKU / Model Name
* Category (Microcontroller / Sensor / Driver / Communication / Power Module)
* Serial Number
* Upload Test Data (simulate)
* Run Diagnostic Button

After clicking:
Show Generated:

* Capability Matrix (table)
* Layer Status
* Reusability Score (%)
* Assigned Grade (A/B/C/D)
* Approved Use Cases (tags)

Button:
"Add to Internal Inventory"
"List on Marketplace"

---

## Inventory Page

Table view:

Columns:

* Component ID
* Type
* Grade
* Reusability %
* Available Quantity
* Location
* Status (Internal / Listed / Sold)

Search bar:
Filter by grade, category, use case.

Card toggle view option.

---

## Analytics Page

Charts:

* Failure Rate by Layer
* Average Reusability by Category
* Value Recovered Per Month

Keep charts simple and clean.

---

# 🔵 3️⃣ MARKETPLACE MODE

Two roles:

BUYER
SELLER

---

## Marketplace Home

Search bar with AI-style placeholder text:

"Describe what you need (e.g., microcontroller with ADC, no WiFi required)"

Below:
Filter panel:

* Category
* Minimum Reusability %
* Grade
* Location
* Price Range

Card-based product listing layout.

Each card shows:

* Component Name
* Verified Badge
* Reusability %
* Grade
* Working Layers Icons
* Disabled Layers Greyed Out
* Price
* Seller Type (Institution / Startup)
* Location
* View Details Button

---

## Component Detail Page

Show:

* Capability Matrix
* Functional Breakdown
* Certification Report
* Approved Use Cases
* Test Timestamp
* Seller Info
* Similar Matches Section

Buttons:

* Contact Seller
* Add to Cart
* Request Bulk

---

## Seller Dashboard

Sidebar:

* My Listings
* Sales
* Inventory
* Analytics

Seller can:

* List graded component
* Set price
* Select approved use cases
* View similarity score matches
* View buyer requests

---

# 🔵 UX REQUIREMENTS

Design must:

* Be extremely clean
* Have generous spacing
* Minimal colors (gray, white, soft blue accent)
* Use soft shadows
* Smooth hover animations
* Subtle microinteractions
* No visual clutter
* Clear data hierarchy

Must feel like:
Notion + Stripe + Linear design aesthetic.

---

# 🔵 FUNCTIONAL LOGIC TO SIMULATE

Add mock data for:

* 10 graded components
* Different categories
* Different grades
* Different reusability %

Add mock AI matching:

If user types:
"GPIO only board"
Show components with:
Working GPIO
WiFi disabled

Simulate similarity score logic.

---

# 🔵 ADDITIONAL FEATURES

Include:

* Verified badge tooltip:
  "Certified by E-Grade Functional Valuation System"

* Grade Explanation Tooltip

* Reusability Score Explanation Modal

---

# 🔵 TECH REQUIREMENTS

* React
* Tailwind
* Component-based architecture
* Clean folder structure
* Reusable UI components
* Responsive layout
* Desktop-first

---

# 🔵 OUTPUT

Provide:

1. Full React code
2. Clean structure
3. No unnecessary comments
4. Production-ready aesthetic
5. Modern SaaS-level UI

