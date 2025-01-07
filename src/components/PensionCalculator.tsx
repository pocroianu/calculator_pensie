import { Calculator } from 'lucide-react';
import InputForm from './InputForm';
import PensionStats from './PensionStats';
import PensionCharts from './PensionCharts';
import { usePensionCalculator } from '../hooks/usePensionCalculator';

const PensionCalculator = () => {
  const { 
    inputs, 
    handleInputChange, 
    monthlyPension,
    yearlyPension,
    pensionDetails,
  } = usePensionCalculator();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calculator className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-medium text-gray-900">Romanian Pension Calculator</h1>
                </div>
                <p className="text-sm text-gray-600">
                  Calculate your pension based on the 2024 Romanian pension system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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