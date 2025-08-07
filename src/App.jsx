import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import TaxBreakdown from './components/TaxBreakdown';
import ScenarioTable from './components/ScenarioTable';
import Modal from './components/Modal';
import { calculateAllTaxes } from './lib/taxCalculations';
import { FILING_STATUS_OPTIONS, STATE_OPTIONS, STATE_TAXES, TAX_BRACKETS } from './constants/taxRates';
import { Settings } from 'lucide-react';

function App() {
  const [stockValue, setStockValue] = useState(1000000);
  const [costBasis, setCostBasis] = useState(500000);
  const [income, setIncome] = useState(200000);
  const [otherGains, setOtherGains] = useState(0);
  const [filingStatus, setFilingStatus] = useState('married');
  const [state, setState] = useState('WA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Temporary state for modal
  const [tempFilingStatus, setTempFilingStatus] = useState(filingStatus);
  const [tempState, setTempState] = useState(state);
  
  // Calculate the gain from stock value minus cost basis
  const gain = Math.max(0, stockValue - costBasis);
  
  // When stock value changes, ensure cost basis doesn't exceed it
  const handleStockValueChange = (value) => {
    setStockValue(value);
    if (costBasis > value) {
      setCostBasis(value);
    }
  };
  
  // Modal handlers
  const openModal = () => {
    setTempFilingStatus(filingStatus);
    setTempState(state);
    setIsModalOpen(true);
  };
  
  const saveModalChanges = () => {
    setFilingStatus(tempFilingStatus);
    setState(tempState);
    setIsModalOpen(false);
  };
  
  const cancelModal = () => {
    setTempFilingStatus(filingStatus);
    setTempState(state);
    setIsModalOpen(false);
  };
  
  const taxResults = useMemo(() => {
    return calculateAllTaxes(gain, income, otherGains, filingStatus, state);
  }, [gain, income, otherGains, filingStatus, state]);
  
  const scenarios = useMemo(() => {
    // Generate scenarios based on different gains relative to current cost basis
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
        setStockValue(1000000);
        setCostBasis(500000);
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
                  label="Current Stock Value"
                  value={stockValue}
                  onChange={handleStockValueChange}
                  min={0}
                  max={2000000}
                  step={10000}
                  helper="Current market value of shares"
                />
                
                <Slider
                  label="Cost Basis"
                  value={costBasis}
                  onChange={setCostBasis}
                  min={0}
                  max={stockValue}
                  step={10000}
                  helper="Original purchase price (held >1 year)"
                />
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Calculated Capital Gain:</span>
                    <span className="font-bold text-lg text-green-600">
                      ${gain.toLocaleString()}
                    </span>
                  </div>
                </div>
                
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
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Tax Profile</div>
                      <div className="text-base">
                        <span className="font-medium">
                          {FILING_STATUS_OPTIONS.find(opt => opt.value === filingStatus)?.label}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="font-medium">{STATE_TAXES[state]?.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {STATE_TAXES[state]?.description}
                      </div>
                    </div>
                    <button
                      onClick={openModal}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Change</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Stock Value:</span>
                  <span className="font-medium">${stockValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Basis:</span>
                  <span className="font-medium">${costBasis.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Capital Gain:</span>
                  <span className="font-medium text-green-600">${gain.toLocaleString()}</span>
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
            {/* Tax Calculation Inputs Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculation Inputs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Total Ordinary Income</span>
                  <span className="font-medium">${income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Capital Gain (This Sale)</span>
                  <span className="font-medium">${gain.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Other Capital Gains</span>
                  <span className="font-medium">${otherGains.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-semibold">Total Capital Gains</span>
                  <span className="font-bold text-green-600">${(gain + otherGains).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                  <span className="text-gray-700 font-semibold">Total Income (AGI)</span>
                  <span className="font-bold text-lg">${(income + gain + otherGains).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Standard Deduction</span>
                  <span className="text-sm">-${TAX_BRACKETS[filingStatus].standardDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-semibold">Taxable Income</span>
                  <span className="font-bold">${Math.max(0, income + gain + otherGains - 
                    TAX_BRACKETS[filingStatus].standardDeduction).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
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
      
      {/* Modal for changing filing status and state */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={cancelModal}
        title="Tax Profile Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filing Status
            </label>
            <select
              value={tempFilingStatus}
              onChange={(e) => setTempFilingStatus(e.target.value)}
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
              value={tempState}
              onChange={(e) => setTempState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {STATE_TAXES[tempState] && (
              <p className="mt-2 text-sm text-gray-600">
                {STATE_TAXES[tempState].description}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={cancelModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveModalChanges}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;