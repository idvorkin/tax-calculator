import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import TaxBreakdown from './components/TaxBreakdown';
import ScenarioTable from './components/ScenarioTable';
import { calculateAllTaxes } from './lib/taxCalculations';
import { FILING_STATUS_OPTIONS, STATE_OPTIONS } from './constants/taxRates';

function App() {
  const [gain, setGain] = useState(500000);
  const [income, setIncome] = useState(200000);
  const [otherGains, setOtherGains] = useState(0);
  const [filingStatus, setFilingStatus] = useState('married');
  const [state, setState] = useState('WA');
  
  const taxResults = useMemo(() => {
    return calculateAllTaxes(gain, income, otherGains, filingStatus, state);
  }, [gain, income, otherGains, filingStatus, state]);
  
  const scenarios = useMemo(() => {
    const gains = [100000, 250000, 500000, 750000, 1000000, 2000000];
    return gains.map(g => {
      const result = calculateAllTaxes(g, income, otherGains, filingStatus, state);
      return {
        gain: g,
        federalTax: result.federalTax.tax,
        niitTax: result.niitTax,
        stateTax: result.stateTax.tax,
        totalTax: result.totalTax,
        netProceeds: result.netProceeds,
        effectiveRate: result.effectiveRate
      };
    });
  }, [income, otherGains, filingStatus, state]);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setGain(500000);
        setIncome(200000);
        setOtherGains(0);
        setFilingStatus('married');
        setState('WA');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stock Tax Calculator
          </h1>
          <p className="text-gray-600">
            Calculate federal and state taxes on long-term capital gains from stock sales
          </p>
        </header>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
              
              <div className="space-y-6">
                <Slider
                  label="Capital Gain from This Sale"
                  value={gain}
                  onChange={setGain}
                  min={0}
                  max={5000000}
                  step={10000}
                  helper="Long-term gain (held >1 year)"
                />
                
                <Slider
                  label="Other Annual Income"
                  value={income}
                  onChange={setIncome}
                  min={0}
                  max={1000000}
                  step={10000}
                  helper="W-2, 1099, other income"
                />
                
                <Slider
                  label="Other Capital Gains This Year"
                  value={otherGains}
                  onChange={setOtherGains}
                  min={0}
                  max={1000000}
                  step={10000}
                  helper="From other stock/asset sales"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FILING_STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Capital Gain:</span>
                  <span className="font-medium">${gain.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="font-medium text-red-600">
                    ${taxResults.totalTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Proceeds:</span>
                  <span className="font-medium text-green-600">
                    ${taxResults.netProceeds.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Tax Rate:</span>
                  <span className="font-medium">
                    {(taxResults.effectiveRate * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <TaxBreakdown {...taxResults} gain={gain} />
          </div>
        </div>
        
        <div className="mt-8">
          <ScenarioTable scenarios={scenarios} />
        </div>
        
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            This calculator provides estimates for educational purposes only. 
            Consult a tax professional for personalized advice.
          </p>
          <p className="mt-2">
            Press <kbd className="px-2 py-1 bg-gray-100 border rounded">Cmd+R</kbd> to reset values
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;