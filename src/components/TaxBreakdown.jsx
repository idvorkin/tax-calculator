import React, { useState } from 'react';
import { Info } from 'lucide-react';
import Tooltip from './Tooltip';

const TaxBreakdown = ({ federalTax, niitTax, stateTax, totalTax, netProceeds, effectiveRate, marginalRates, gain }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const TaxRow = ({ label, amount, rate, marginalRate, info }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <span className="text-gray-700">{label}</span>
        {info && (
          <Tooltip text={info}>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </Tooltip>
        )}
      </div>
      <div className="text-right">
        <div className="font-medium">${amount.toLocaleString()}</div>
        <div className="text-xs text-gray-500">
          Effective: {(rate * 100).toFixed(2)}%
          {marginalRate !== undefined && ` | Marginal: ${(marginalRate * 100).toFixed(2)}%`}
        </div>
      </div>
    </div>
  );
  
  const DetailRow = ({ label, value, isPercentage = false }) => (
    <div className="flex justify-between items-center py-1 px-4 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800">
        {isPercentage ? `${(value * 100).toFixed(2)}%` : `$${value.toLocaleString()}`}
      </span>
    </div>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tax Breakdown</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      <div className="space-y-1">
        <TaxRow 
          label="Federal Capital Gains Tax" 
          amount={federalTax.tax} 
          rate={federalTax.rate}
          marginalRate={marginalRates.federal}
          info="Based on your income and filing status"
        />
        
        {niitTax > 0 && (
          <TaxRow 
            label="Net Investment Income Tax (NIIT)" 
            amount={niitTax} 
            rate={niitTax / gain}
            marginalRate={marginalRates.niit}
            info="3.8% tax on investment income for high earners"
          />
        )}
        
        <TaxRow 
          label="State Tax" 
          amount={stateTax.tax} 
          rate={stateTax.effectiveRate}
          marginalRate={marginalRates.state}
          info="State-specific capital gains tax"
        />
        
        <div className="pt-2 mt-2 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Tax</span>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                ${totalTax.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Effective: {(effectiveRate * 100).toFixed(2)}% | Marginal: {(marginalRates.total * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold text-gray-900">Net Proceeds</span>
          <div className="text-lg font-bold text-green-600">
            ${netProceeds.toLocaleString()}
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 px-4 pb-2">Marginal Tax Rates</h4>
          <DetailRow label="Federal Marginal Rate" value={marginalRates.federal} isPercentage />
          <DetailRow label="NIIT Marginal Rate" value={marginalRates.niit} isPercentage />
          <DetailRow label="State Marginal Rate" value={marginalRates.state} isPercentage />
          <DetailRow label="Combined Marginal Rate" value={marginalRates.total} isPercentage />
          
          <h4 className="font-medium text-gray-700 px-4 pt-3 pb-2">Effective Tax Rates</h4>
          <DetailRow label="Federal Effective Rate" value={federalTax.rate} isPercentage />
          {niitTax > 0 && <DetailRow label="NIIT Effective Rate" value={niitTax / gain} isPercentage />}
          <DetailRow label="State Effective Rate" value={stateTax.effectiveRate} isPercentage />
          <DetailRow label="Combined Effective Rate" value={effectiveRate} isPercentage />
        </div>
      )}
    </div>
  );
};

export default TaxBreakdown;