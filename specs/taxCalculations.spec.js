import { describe, it, expect } from 'vitest';
import { 
  calculateFederalTax, 
  calculateNIIT, 
  calculateStateTax,
  calculateAllTaxes 
} from '../src/lib/taxCalculations.js';

describe('Federal Tax Calculations', () => {
  it('should calculate zero federal tax for gains within 0% bracket', () => {
    const result = calculateFederalTax(50000, 60000, 'married');
    expect(result.tax).toBe(0);
    expect(result.rate).toBe(0);
  });
  
  it('should calculate federal tax correctly across brackets', () => {
    const result = calculateFederalTax(600000, 100000, 'married');
    const expectedTax = (489700 * 0.15) + (600000 - 489700) * 0.20;
    expect(result.tax).toBeCloseTo(expectedTax, 2);
  });
  
  it('should handle single filer brackets correctly', () => {
    const result = calculateFederalTax(100000, 50000, 'single');
    const expectedTax = (35400 * 0) + (64600 * 0.15);
    expect(result.tax).toBeCloseTo(expectedTax, 2);
  });
});

describe('NIIT Calculations', () => {
  it('should not apply NIIT below threshold', () => {
    const niit = calculateNIIT(50000, 150000, 0, 'married');
    expect(niit).toBe(0);
  });
  
  it('should apply NIIT above threshold for married filing jointly', () => {
    const niit = calculateNIIT(100000, 200000, 0, 'married');
    const expectedNIIT = 50000 * 0.038;
    expect(niit).toBeCloseTo(expectedNIIT, 2);
  });
  
  it('should apply NIIT to full gain when well above threshold', () => {
    const niit = calculateNIIT(100000, 500000, 0, 'single');
    const expectedNIIT = 100000 * 0.038;
    expect(niit).toBeCloseTo(expectedNIIT, 2);
  });
});

describe('State Tax Calculations', () => {
  describe('Washington State', () => {
    it('should not tax gains below threshold', () => {
      const result = calculateStateTax(100000, 100000, 0, 'WA');
      expect(result.tax).toBe(0);
      expect(result.effectiveRate).toBe(0);
    });
    
    it('should tax only amount above threshold', () => {
      const result = calculateStateTax(300000, 100000, 0, 'WA');
      const expectedTax = 38000 * 0.07;
      expect(result.tax).toBeCloseTo(expectedTax, 2);
    });
    
    it('should consider other gains for threshold', () => {
      const result = calculateStateTax(100000, 100000, 200000, 'WA');
      const expectedTax = 38000 * 0.07;
      expect(result.tax).toBeCloseTo(expectedTax, 2);
    });
  });
  
  describe('California', () => {
    it('should apply flat rate to all gains', () => {
      const result = calculateStateTax(100000, 100000, 0, 'CA');
      expect(result.tax).toBeCloseTo(13300, 2);
      expect(result.effectiveRate).toBeCloseTo(0.133, 3);
    });
  });
  
  describe('Massachusetts', () => {
    it('should apply base rate below $1M', () => {
      const result = calculateStateTax(100000, 200000, 0, 'MA');
      expect(result.tax).toBeCloseTo(5000, 2);
    });
    
    it('should apply millionaire tax above $1M', () => {
      const result = calculateStateTax(500000, 600000, 0, 'MA');
      const baseTax = 500000 * 0.05;
      const millionaireTax = 100000 * 0.04;
      expect(result.tax).toBeCloseTo(baseTax + millionaireTax, 2);
    });
  });
  
  describe('Texas', () => {
    it('should have zero state tax', () => {
      const result = calculateStateTax(1000000, 500000, 0, 'TX');
      expect(result.tax).toBe(0);
      expect(result.effectiveRate).toBe(0);
    });
  });
});

describe('Complete Tax Calculations', () => {
  it('should calculate all taxes correctly for a complex scenario', () => {
    const result = calculateAllTaxes(500000, 300000, 100000, 'married', 'CA');
    
    expect(result.federalTax.tax).toBeGreaterThan(0);
    expect(result.niitTax).toBeGreaterThan(0);
    expect(result.stateTax.tax).toBeGreaterThan(0);
    expect(result.totalTax).toBe(
      result.federalTax.tax + result.niitTax + result.stateTax.tax
    );
    expect(result.netProceeds).toBe(500000 - result.totalTax);
    expect(result.effectiveRate).toBeCloseTo(result.totalTax / 500000, 4);
  });
  
  it('should handle zero gain scenario', () => {
    const result = calculateAllTaxes(0, 100000, 0, 'single', 'TX');
    
    expect(result.federalTax.tax).toBe(0);
    expect(result.niitTax).toBe(0);
    expect(result.stateTax.tax).toBe(0);
    expect(result.totalTax).toBe(0);
    expect(result.netProceeds).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });
});