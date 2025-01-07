import { Calculator } from 'lucide-react';
import InputForm from './InputForm';
import PensionStats from './PensionStats';
import { usePensionCalculator } from '../hooks/usePensionCalculator';

const PensionCalculator = () => {
  const { 
    inputs, 
    handleInputChange, 
    monthlyPension,
    yearlyPension,
    pensionDetails,
    yearsUntilRetirement
  } = usePensionCalculator();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-2 justify-center text-center">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Romanian Pension Calculator</h1>
          </div>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Calculate your pension based on the 2024 Romanian pension system
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="lg:sticky lg:top-6 h-fit">
            <InputForm
              inputs={inputs}
              onChange={handleInputChange}
            />
          </div>

          {/* Stats */}
          <div>
            <PensionStats
              monthlyPension={monthlyPension}
              pensionDetails={pensionDetails}
              inputs={inputs}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PensionCalculator;