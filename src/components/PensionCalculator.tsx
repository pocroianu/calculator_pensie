import React from 'react';
import PensionStats from './PensionStats';
import InputForm from './InputForm';
import PensionCharts from './PensionCharts';
import { usePensionCalculator } from '../hooks/usePensionCalculator';

const PensionCalculator: React.FC = () => {
  const { 
    inputs, 
    handleInputChange, 
    monthlyPension,
    pensionDetails,
  } = usePensionCalculator();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Input Form */}
            <div className="lg:sticky lg:top-6">
              <InputForm
                inputs={inputs}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PensionStats
              monthlyPension={monthlyPension}
              pensionDetails={pensionDetails}
              inputs={inputs}
            />
            <PensionCharts
              contributionPeriods={inputs.contributionPeriods}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PensionCalculator;