import React from 'react';
import { Calculator } from 'lucide-react';
import InputForm from './InputForm';
import DateInputs from './DateInputs';
import PensionSummary from './PensionSummary';
import PensionStats from './PensionStats';
import { usePensionCalculator } from '../hooks/usePensionCalculator';

const PensionCalculator: React.FC = () => {
  const { 
    inputs, 
    handleInputChange,
    monthlyPension, 
    yearlyPension, 
    yearsUntilRetirement,
    contributionPoints,
    pensionDetails,
    addWorkingPeriod,
    removeWorkingPeriod,
    averageGrossSalary
  } = usePensionCalculator();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Romanian Pension Calculator</h1>
        </div>
        <p className="text-gray-600">Calculate your pension based on the 2024 Romanian pension system</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DateInputs 
            birthDate={inputs.birthDate}
            retirementYear={inputs.retirementYear}
            onChange={handleInputChange}
          />
          <InputForm 
            inputs={inputs} 
            onChange={handleInputChange} 
            onAddWorkingPeriod={addWorkingPeriod}
            onRemoveWorkingPeriod={removeWorkingPeriod}
          />
        </div>
        
        <div className="space-y-8">
          <PensionSummary 
            monthlyPension={monthlyPension} 
            yearlyPension={yearlyPension}
          />
          <PensionStats
            birthDate={inputs.birthDate}
            contributionYears={inputs.contributionYears}
            workingPeriods={inputs.workingPeriods}
            monthlyGrossSalary={inputs.monthlyGrossSalary}
            yearsUntilRetirement={yearsUntilRetirement}
            contributionPoints={contributionPoints}
            referenceValue={inputs.referenceValue}
            monthlyPension={monthlyPension}
            yearlyPension={yearlyPension}
            pensionDetails={pensionDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default PensionCalculator;