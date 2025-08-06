export const TAX_BRACKETS = {
  married: {
    federal: [
      { min: 0, max: 94050, rate: 0 },
      { min: 94051, max: 583750, rate: 0.15 },
      { min: 583751, max: Infinity, rate: 0.20 }
    ],
    niitThreshold: 250000,
    standardDeduction: 29200
  },
  single: {
    federal: [
      { min: 0, max: 47025, rate: 0 },
      { min: 47026, max: 518900, rate: 0.15 },
      { min: 518901, max: Infinity, rate: 0.20 }
    ],
    niitThreshold: 200000,
    standardDeduction: 14600
  },
  head: {
    federal: [
      { min: 0, max: 63000, rate: 0 },
      { min: 63001, max: 551350, rate: 0.15 },
      { min: 551351, max: Infinity, rate: 0.20 }
    ],
    niitThreshold: 200000,
    standardDeduction: 21900
  }
};

export const STATE_TAXES = {
  WA: { 
    rate: 0.07, 
    threshold: 262000, 
    name: "Washington", 
    description: "7% on long-term gains exceeding $262K"
  },
  CA: { 
    rate: 0.133, 
    threshold: 0, 
    name: "California", 
    description: "13.3% on all gains" 
  },
  NY: { 
    rate: 0.109, 
    threshold: 0, 
    name: "New York", 
    description: "10.9% on all gains" 
  },
  TX: { 
    rate: 0, 
    threshold: Infinity, 
    name: "Texas", 
    description: "No state capital gains tax" 
  },
  FL: { 
    rate: 0, 
    threshold: Infinity, 
    name: "Florida", 
    description: "No state capital gains tax" 
  },
  NV: { 
    rate: 0, 
    threshold: Infinity, 
    name: "Nevada", 
    description: "No state capital gains tax" 
  },
  CO: { 
    rate: 0.044, 
    threshold: 0, 
    name: "Colorado", 
    description: "4.4% flat tax on all gains" 
  },
  MA: { 
    rate: 0.05, 
    threshold: 0, 
    name: "Massachusetts", 
    millionaireTax: 0.04, 
    description: "5% + 4% on income over $1M" 
  }
};

export const FILING_STATUS_OPTIONS = [
  { value: 'married', label: 'Married Filing Jointly' },
  { value: 'single', label: 'Single' },
  { value: 'head', label: 'Head of Household' }
];

export const STATE_OPTIONS = Object.entries(STATE_TAXES).map(([value, data]) => ({
  value,
  label: data.name
}));