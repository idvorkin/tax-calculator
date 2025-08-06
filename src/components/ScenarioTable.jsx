import React from 'react';

const ScenarioTable = ({ scenarios }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Comparison</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-2 px-3">Gain Amount</th>
            <th className="text-right py-2 px-3">Federal Tax</th>
            <th className="text-right py-2 px-3">NIIT</th>
            <th className="text-right py-2 px-3">State Tax</th>
            <th className="text-right py-2 px-3">Total Tax</th>
            <th className="text-right py-2 px-3">Net Proceeds</th>
            <th className="text-right py-2 px-3">Effective Rate</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3 font-medium">${scenario.gain.toLocaleString()}</td>
              <td className="text-right py-2 px-3">${scenario.federalTax.toLocaleString()}</td>
              <td className="text-right py-2 px-3">${scenario.niitTax.toLocaleString()}</td>
              <td className="text-right py-2 px-3">${scenario.stateTax.toLocaleString()}</td>
              <td className="text-right py-2 px-3 font-medium text-red-600">
                ${scenario.totalTax.toLocaleString()}
              </td>
              <td className="text-right py-2 px-3 font-medium text-green-600">
                ${scenario.netProceeds.toLocaleString()}
              </td>
              <td className="text-right py-2 px-3">{(scenario.effectiveRate * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ScenarioTable;