export interface CalculatorInputs {
  // Personal Information
  birthDate: string;
  retirementYear: number;
  
  // Contribution Details
  contributionYears: number;
  monthlyGrossSalary: number;
  overtimeHours: number;
  
  // Working Conditions
  hasHazardousConditions: boolean;
  hasSpecialConditions: boolean;
  
  // Historical Data
  contributionPoints: number;
  referenceValue: number;
}