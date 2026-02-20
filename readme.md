# ReBoard – Electronic Asset Recovery & Circular Exchange Platform

ReBoard is a modern web platform designed to prevent functional electronics from becoming waste. It provides graded functional valuation and circular allocation for electronic components through automated testing, reusability scoring, and a marketplace for buying and selling tested components.

Live site: [https://reboardindia.vercel.app/](https://reboardindia.vercel.app/)



## Overview

ReBoard operates in two primary modes:

1. **Institutional Mode** - Internal asset recovery tool for colleges, labs, and startups to test, grade, and manage electronic components
2. **Marketplace Mode** - Buy and sell platform for verified, graded electronic components

## Features

### Institutional Dashboard
- **Component Testing** - Upload test data and run diagnostics to generate capability matrices, reusability scores, and grades
- **Inventory Management** - Track components with filtering, search, and status management
- **Analytics** - Visualize recovery trends, failure rates, and reusability metrics
- **Component Grading** - Automated A/B/C/D grading system based on functional testing
- **Reusability Scoring** - AI-powered scoring to determine component reuse potential

### Marketplace
- **Smart Search** - Natural language search to find components matching specific requirements
- **Advanced Filtering** - Filter by category, grade, reusability percentage, location, and price
- **Component Details** - Comprehensive view with capability matrices, certification reports, and approved use cases
- **Shopping Cart** - Add components to cart and checkout flow
- **Similar Matches** - AI-powered matching to find alternative components

## Tech Stack

- **React 18** - Modern React with functional components
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for analytics
- **html2pdf.js** - PDF generation for reports

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
reboard/
├── public/
│   └── sample-data/          # Sample test data files
├── src/
│   ├── components/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Layout components
│   ├── pages/                # Page components
│   │   ├── institution/      # Institution dashboard pages
│   │   └── marketplace/      # Marketplace pages
│   ├── services/             # API and service functions
│   ├── data/                 # Mock data and constants
│   ├── App.jsx               # Main app component with routes
│   └── main.jsx              # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Usage

### Testing a Component

1. Navigate to the Institution Dashboard
2. Go to "Test New Component"
3. Fill in component details (type, SKU, category, serial number)
4. Upload test data or use sample data
5. Click "Run Diagnostic" to generate:
   - Capability Matrix
   - Layer Status
   - Reusability Score
   - Assigned Grade (A/B/C/D)
   - Approved Use Cases
6. Add to inventory or list on marketplace

### Using the Marketplace

1. Navigate to Marketplace from the landing page
2. Use the search bar to describe what you need (e.g., "microcontroller with ADC, no WiFi required")
3. Apply filters to narrow down results
4. Click "View Details" on any component to see full specifications
5. Add to cart and proceed to checkout

## Component Grading System

Components are graded based on functional testing:

- **Grade A** - Fully functional, all layers working
- **Grade B** - Minor limitations, most layers functional
- **Grade C** - Significant limitations, partial functionality
- **Grade D** - Limited functionality, specific use cases only

## Reusability Scoring

The reusability score (0-100%) indicates how suitable a component is for reuse:
- Based on functional layer testing
- Considers component condition and capabilities
- Helps match components to appropriate use cases

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- Functional React components
- Tailwind CSS for styling
- Component-based architecture
- Clean, minimal design aesthetic

## License

This project is provided under a simple free-use license:

- You may use, copy, modify, and distribute this software, in source or binary form, for personal or commercial purposes, with or without modification.
- Please include reasonable attribution to the ReBoard project and its original authors in your product documentation or about page.
- This software is provided \"as is\", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
