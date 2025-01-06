import React from 'react';
import { Calculator } from 'lucide-react';

interface PensionSummaryProps {
  monthlyPension: number;
  yearlyPension: number;
}

const PensionSummary: React.FC<PensionSummaryProps> = ({ monthlyPension, yearlyPension }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Estimated Pension</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Pension</p>
            <p className="text-4xl font-bold text-blue-600">{monthlyPension.toLocaleString()} Lei</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Yearly Pension</p>
            <p className="text-2xl font-semibold text-blue-600">{yearlyPension.toLocaleString()} Lei</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          *Based on the 2024 Romanian pension calculation formula
        </p>
      </div>
    </div>
  );
};

export default PensionSummary;