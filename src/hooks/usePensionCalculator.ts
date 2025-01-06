import { useState, useEffect } from 'react';
import { PensionInputs } from '../types/pensionTypes';
import { 
  calculateContributionPoints, 
  calculateMonthlyPension, 
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
  
  const [inputs, setInputs] = useState<PensionInputs>({
    birthDate: '1996-08-26',
    retirementYear: currentYear + 35,
    contributionPeriods: [
      {
        fromDate: '2018-01-01' ,
        toDate: '2020-12-31',
        company: 'Company A',
        monthlyGrossSalary: 4050,
        workingCondition: 'normal'
      },
      {
        fromDate: '2021-01-01' ,
        toDate: '2024-12-31',
        company: 'Company B',
        monthlyGrossSalary: 5050,
        workingCondition: 'normal'
      }
    ]
  });

  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [yearlyPension, setYearlyPension] = useState<number>(0);
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState<number>(0);
  const [contributionPoints, setContributionPoints] = useState<number>(0);
  const [pensionDetails, setPensionDetails] = useState<PensionDetails>({
    basePoints: 0,
    stabilityPoints: 0,
    workingConditions: { bonus: 0, periods: [] },
    nonContributive: { total: 0, periods: [] },
    total: 0
  });

  useEffect(() => {
    // Calculate contribution points based on salary
    const points = calculateContributionPoints(inputs.contributionPeriods.reduce((acc, period) => {
      const periodPoints = calculateContributionPoints(period.monthlyGrossSalary, AVERAGE_GROSS_SALARY_2024);
      return acc + periodPoints;
    }, 0));
    setContributionPoints(points);

    // Update years until retirement
    const birthDate = new Date(inputs.birthDate);
    const retired = isRetired(birthDate.getFullYear().toString());
    const yearsUntil = retired ? 0 : inputs.retirementYear - currentYear;
    setYearsUntilRetirement(yearsUntil);

    // Calculate pension with non-contributive periods
    const nonContributivePeriods: NonContributivePeriod[] = [];

    // Calculate pension
    const result = calculateMonthlyPension(
      inputs.contributionPeriods.reduce((acc, period) => acc + period.contributionYears, 0),
      points * inputs.contributionPeriods.reduce((acc, period) => acc + period.contributionYears, 0),
      REFERENCE_VALUE_2024,
      inputs.contributionPeriods.map(period => ({ condition: period.condition, fromAge: period.fromAge, toAge: period.toAge })),
      nonContributivePeriods
    );

    setMonthlyPension(result.monthlyPension);
    setYearlyPension(result.monthlyPension * 12);
    setPensionDetails(result.details);
  }, [inputs, currentYear]);

  const handleInputChange = (field: keyof PensionInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
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
    averageGrossSalary: AVERAGE_GROSS_SALARY_2024
  };
};