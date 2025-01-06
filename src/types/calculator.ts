import { WorkingCondition } from '../utils/pensionCalculations';

export interface WorkingPeriod {
  condition: WorkingCondition;
  fromAge: number;
  toAge: number;
}

export interface CalculatorInputs {
  // Personal Information
  birthDate: string;
  retirementYear: number;
  
  // Contribution Details
  contributionYears: number;
  monthlyGrossSalary: number;
  overtimeHours: number;
  
  // Working Conditions
  workingPeriod: WorkingPeriod;
  
  // Non-contributive Periods
  militaryYears: number;
  universityYears: number;
  childCareYears: number;
  medicalYears: number;
  
  // Calculation Details
  contributionPoints: number;
  referenceValue: number;
}