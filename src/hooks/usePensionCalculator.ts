import { useState, useEffect } from 'react';
import { CalculatorInputs } from '../types/calculator';
import { 
  calculateContributionPoints, 
  calculateMonthlyPension, 
  WorkingPeriod,
  NonContributivePeriod,
  WorkingConditionsResult,
  NonContributiveResult
} from '../utils/pensionCalculations';
import { isRetired } from '../utils/dateCalculations';

const REFERENCE_VALUE_2024 = 81.03;
const AVERAGE_GROSS_SALARY_2024 = 6789; // Romanian average gross salary 2024

export interface PensionDetails {
  basePoints: number;
  stabilityPoints: number;
  workingConditions: WorkingConditionsResult;
  nonContributive: NonContributiveResult;
  total: number;
}

export const usePensionCalculator = () => {
  const currentYear = new Date().getFullYear();
  
  const calculateInitialPoints = (salary: number) => {
    return calculateContributionPoints(salary, AVERAGE_GROSS_SALARY_2024);
  };

  const [inputs, setInputs] = useState<CalculatorInputs>({
    birthDate: "1995-01-01",
    retirementYear: currentYear + 35,
    contributionYears: 25,
    monthlyGrossSalary: 5000,
    overtimeHours: 0,
    workingPeriods: [{
      condition: 'none' as const,
      fromAge: 18,
      toAge: 25
    }],
    militaryYears: 0,
    universityYears: 0,
    childCareYears: 0,
    medicalYears: 0,
    contributionPoints: calculateInitialPoints(5000),
    referenceValue: REFERENCE_VALUE_2024
  });

  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [yearlyPension, setYearlyPension] = useState<number>(0);
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState<number>(0);
  const [contributionPoints, setContributionPoints] = useState<number>(calculateInitialPoints(5000));
  const [pensionDetails, setPensionDetails] = useState<PensionDetails>({
    basePoints: 0,
    stabilityPoints: 0,
    workingConditions: { bonus: 0, periods: [] },
    nonContributive: { total: 0, periods: [] },
    total: 0
  });

  useEffect(() => {
    // Calculate contribution points based on salary
    const points = calculateContributionPoints(inputs.monthlyGrossSalary, AVERAGE_GROSS_SALARY_2024);
    setContributionPoints(points);

    // Update years until retirement
    const birthDate = new Date(inputs.birthDate);
    const retired = isRetired(birthDate.getFullYear().toString());
    const yearsUntil = retired ? 0 : inputs.retirementYear - currentYear;
    setYearsUntilRetirement(yearsUntil);

    // Calculate pension with non-contributive periods
    const nonContributivePeriods: NonContributivePeriod[] = [
      { type: 'military', years: inputs.militaryYears },
      { type: 'university', years: inputs.universityYears },
      { type: 'childCare', years: inputs.childCareYears },
      { type: 'medical', years: inputs.medicalYears }
    ].filter(period => period.years > 0);

    // Calculate pension
    const result = calculateMonthlyPension(
      inputs.contributionYears,
      points * inputs.contributionYears,
      inputs.referenceValue,
      inputs.workingPeriods,
      nonContributivePeriods
    );

    setMonthlyPension(result.monthlyPension);
    setYearlyPension(result.monthlyPension * 12);
    setPensionDetails(result.details);
  }, [inputs, currentYear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => {
      // Handle nested workingPeriods updates
      if (name.startsWith('workingPeriods[')) {
        const matches = name.match(/workingPeriods\[(\d+)\]\.(.+)/);
        if (matches) {
          const [, index, field] = matches;
          const newWorkingPeriods = [...prev.workingPeriods];
          newWorkingPeriods[parseInt(index)] = {
            ...newWorkingPeriods[parseInt(index)],
            [field]: field === 'condition' ? value : (parseFloat(value) || 0)
          };
          return {
            ...prev,
            workingPeriods: newWorkingPeriods
          };
        }
      }

      // Handle other fields
      const newValue = name === 'birthDate' ? value : 
                      (typeof value === 'boolean' ? value : (parseFloat(value) || 0));

      // If updating salary, recalculate contribution points
      if (name === 'monthlyGrossSalary') {
        const newPoints = calculateContributionPoints(parseFloat(value) || 0, AVERAGE_GROSS_SALARY_2024);
        return {
          ...prev,
          [name]: newValue,
          contributionPoints: newPoints
        };
      }

      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  const addWorkingPeriod = () => {
    setInputs(prev => ({
      ...prev,
      workingPeriods: [
        ...prev.workingPeriods,
        {
          condition: 'none',
          fromAge: 18,
          toAge: 25
        }
      ]
    }));
  };

  const removeWorkingPeriod = (index: number) => {
    setInputs(prev => ({
      ...prev,
      workingPeriods: prev.workingPeriods.filter((_, i) => i !== index)
    }));
  };

  return {
    inputs,
    handleInputChange,
    monthlyPension,
    yearlyPension,
    yearsUntilRetirement,
    contributionPoints,
    pensionDetails,
    addWorkingPeriod,
    removeWorkingPeriod,
    averageGrossSalary: AVERAGE_GROSS_SALARY_2024
  };
};