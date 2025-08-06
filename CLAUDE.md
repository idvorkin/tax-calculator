# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite) on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- `npm test` - Run all tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report

### Code Quality
- `npm run lint` - Run ESLint on all JS/JSX/TS/TSX files
- `npm run format` - Format code with Prettier

## Architecture

### Project Structure
The application is organized into clear separation of concerns:

- **src/lib/** - Pure business logic functions for tax calculations
  - `taxCalculations.js` - Core tax calculation functions (federal, state, NIIT)
  - `formatters.js` - Number formatting utilities

- **src/components/** - Reusable React components
  - Each component is self-contained with its own file
  - Components use Tailwind CSS for styling

- **src/constants/** - Tax rates and configuration data
  - `taxRates.js` - Federal/state tax brackets and thresholds

- **specs/** - Test files using Vitest
  - Tests are co-located with feature names (e.g., taxCalculations.spec.js)

### Key Design Patterns

1. **Separation of Logic and UI**: All tax calculations are pure functions in `src/lib/`, making them easily testable and reusable.

2. **Component Composition**: UI is built from small, focused components that are composed in `App.jsx`.

3. **Memoization**: The app uses React's `useMemo` to optimize expensive calculations and prevent unnecessary re-renders.

4. **State Management**: Simple React state with hooks - no external state management needed for this scope.

### Tax Calculation Flow

1. User inputs (gain, income, filing status, state) trigger recalculation
2. `calculateAllTaxes()` orchestrates all tax calculations
3. Results flow through components for display
4. Scenario table shows multiple gain amounts for comparison

### Testing Strategy

- Unit tests for all tax calculation functions in `specs/taxCalculations.spec.js`
- Test edge cases like threshold boundaries, zero gains, and state-specific rules
- Run tests before commits to ensure calculations remain accurate