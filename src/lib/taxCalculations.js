import { TAX_BRACKETS, STATE_TAXES } from '../constants/taxRates.js';

export const calculateFederalTax = (gain, income, filingStatus) => {
  const brackets = TAX_BRACKETS[filingStatus].federal;
  const standardDeduction = TAX_BRACKETS[filingStatus].standardDeduction;
  const incomeWithoutGain = Math.max(0, income - standardDeduction);
  
  let remainingGain = gain;
  let tax = 0;
  
  for (const bracket of brackets) {
    if (incomeWithoutGain >= bracket.max) continue;
    
    const roomInBracket = bracket.max - Math.max(incomeWithoutGain, bracket.min);
    const gainInBracket = Math.min(remainingGain, roomInBracket);
    
    tax += gainInBracket * bracket.rate;
    remainingGain -= gainInBracket;
    
    if (remainingGain <= 0) break;
  }
  
  const avgRate = gain > 0 ? tax / gain : 0;
  return { tax, rate: avgRate };
};

export const calculateNIIT = (gain, income, otherGains, filingStatus) => {
  const threshold = TAX_BRACKETS[filingStatus].niitThreshold;
  const totalIncome = income + gain + otherGains;
  
  if (totalIncome > threshold) {
    const taxableAmount = Math.min(gain, totalIncome - threshold);
    return taxableAmount * 0.038;
  }
  return 0;
};

export const calculateStateTax = (gain, income, otherGains, state) => {
  const stateTax = STATE_TAXES[state];
  const totalCapitalGains = gain + otherGains;
  
  if (state === 'WA') {
    if (totalCapitalGains > stateTax.threshold) {
      const taxableAmount = totalCapitalGains - stateTax.threshold;
      const taxOnGain = Math.min(gain, taxableAmount) * stateTax.rate;
      const effectiveRate = taxOnGain / gain;
      return { 
        tax: taxOnGain, 
        effectiveRate: effectiveRate, 
        marginalRate: totalCapitalGains >= stateTax.threshold ? stateTax.rate : 0 
      };
    }
    return { tax: 0, effectiveRate: 0, marginalRate: 0 };
  } else if (state === 'MA') {
    const totalIncome = income + totalCapitalGains;
    let tax = gain * stateTax.rate;
    let marginalRate = stateTax.rate;
    
    if (totalIncome > 1000000 && stateTax.millionaireTax) {
      const incomeOverMillion = totalIncome - 1000000;
      const gainSubjectToMillionaireTax = Math.min(gain, incomeOverMillion);
      tax += gainSubjectToMillionaireTax * stateTax.millionaireTax;
      marginalRate = stateTax.rate + stateTax.millionaireTax;
    }
    
    return { tax, effectiveRate: tax / gain, marginalRate };
  } else {
    const tax = gain * stateTax.rate;
    return { tax, effectiveRate: stateTax.rate, marginalRate: stateTax.rate };
  }
};

export const calculateMarginalRates = (gain, income, otherGains, filingStatus, state) => {
  const testGain = 1000;
  
  const currentFederal = calculateFederalTax(gain, income, filingStatus);
  const nextFederal = calculateFederalTax(gain + testGain, income, filingStatus);
  const federalMarginal = (nextFederal.tax - currentFederal.tax) / testGain;
  
  const currentNIIT = calculateNIIT(gain, income, otherGains, filingStatus);
  const nextNIIT = calculateNIIT(gain + testGain, income, otherGains, filingStatus);
  const niitMarginal = (nextNIIT - currentNIIT) / testGain;
  
  const currentState = calculateStateTax(gain, income, otherGains, state);
  const nextState = calculateStateTax(gain + testGain, income, otherGains, state);
  const stateMarginal = (nextState.tax - currentState.tax) / testGain;
  
  return {
    federal: federalMarginal,
    niit: niitMarginal,
    state: stateMarginal,
    total: federalMarginal + niitMarginal + stateMarginal
  };
};

export const calculateAllTaxes = (gain, income, otherGains, filingStatus, state) => {
  const federalTax = calculateFederalTax(gain, income, filingStatus);
  const niitTax = calculateNIIT(gain, income, otherGains, filingStatus);
  const stateTaxResult = calculateStateTax(gain, income, otherGains, state);
  
  const totalTax = federalTax.tax + niitTax + stateTaxResult.tax;
  const netProceeds = gain - totalTax;
  const effectiveRate = gain > 0 ? totalTax / gain : 0;
  
  const marginalRates = calculateMarginalRates(gain, income, otherGains, filingStatus, state);
  
  return {
    federalTax,
    niitTax,
    stateTax: stateTaxResult,
    totalTax,
    netProceeds,
    effectiveRate,
    marginalRates
  };
};