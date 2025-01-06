import { useState, useEffect } from 'react';
import { CalculatorInputs } from '../types/calculator';
import { calculateMonthlyPension, calculateContributionPoints, REFERENCE_VALUE_2024 } from '../utils/pensionCalculations';
import { isRetired } from '../utils/dateCalculations';

export const usePensionCalculator = () => {
  const currentYear = new Date().getFullYear();
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
    birthYear: currentYear - 30, // Default to 30 years old
    retirementYear: currentYear + 35, // Default to 35 years until retirement
    contributionYears: 25,
    monthlyGrossSalary: 5000,
    overtimeHours: 0,
    hasHazardousConditions: false,
    hasSpecialConditions: false,
    contributionPoints: 0,
    referenceValue: REFERENCE_VALUE_2024
  });

  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [yearlyPension, setYearlyPension] = useState<number>(0);
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState<number>(0);

  useEffect(() => {
    const retired = isRetired(inputs.birthYear);
    const yearsUntil = retired ? 0 : inputs.retirementYear - currentYear;
    setYearsUntilRetirement(yearsUntil);

    // Calculate pension
    const averageGrossSalary = 6789; // Romanian average gross salary 2024
    const points = calculateContributionPoints(inputs.monthlyGrossSalary, averageGrossSalary);
    
    const monthly = calculateMonthlyPension(
      inputs.contributionYears,
      points * inputs.contributionYears,
      inputs.referenceValue,
      inputs.hasSpecialConditions,
      inputs.hasHazardousConditions
    );

    setMonthlyPension(monthly);
    setYearlyPension(monthly * 12);
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: typeof value === 'boolean' ? value : (parseFloat(value) || value)
    }));
  };

  return {
    inputs,
    monthlyPension,
    yearlyPension,
    yearsUntilRetirement,
    handleInputChange
  };
};