# Stock Tax Calculator

A React-based web application for calculating federal and state taxes on long-term capital gains from stock sales.

## Features

- Calculate federal capital gains tax based on income and filing status
- Calculate Net Investment Income Tax (NIIT) for high earners
- State-specific tax calculations for all US states
- Interactive sliders for adjusting parameters
- Scenario comparison table
- Real-time tax breakdown with effective and marginal rates

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:5173 to view the application.

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Deployment

### Deploy to Vercel

#### Option 1: Using Vercel CLI

1. Install Vercel CLI globally (if not already installed):
```bash
npm i -g vercel
```

2. Deploy to production:
```bash
npm run deploy
```

Or deploy a preview:
```bash
npm run deploy:preview
```

#### Option 2: Using Git Integration

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect the Vite framework
4. Deploy with default settings

The app will be automatically deployed on every push to the main branch.

## Project Structure

```
src/
├── lib/              # Business logic
│   ├── taxCalculations.js
│   └── formatters.js
├── components/       # React components
│   ├── Slider.jsx
│   ├── TaxBreakdown.jsx
│   ├── ScenarioTable.jsx
│   └── Tooltip.jsx
├── constants/        # Tax rates and configurations
│   └── taxRates.js
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
└── index.css        # Tailwind CSS styles

specs/               # Test files
├── taxCalculations.spec.js
└── setup.js
```

## Tax Calculations

The calculator handles:

- **Federal Capital Gains Tax**: Based on income brackets and filing status (0%, 15%, 20%)
- **Net Investment Income Tax (NIIT)**: 3.8% for high earners
- **State Taxes**: Varies by state, including special rules for WA and MA

## Technologies

- React 18
- Vite
- Tailwind CSS
- Vitest for testing
- Lucide React for icons