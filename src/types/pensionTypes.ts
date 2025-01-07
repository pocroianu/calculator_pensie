export type WorkingCondition = 'normal' | 'special' | 'difficult' | 'veryDifficult';
export type NonContributivePeriodType = 'military' | 'university' | 'childCare' | 'medical' | '';

export interface ContributionPeriod {
  fromDate: string;
  toDate: string;
  company?: string;
  monthlyGrossSalary?: number;
  workingCondition?: WorkingCondition;
  nonContributiveType?: NonContributivePeriodType;
}

export interface PensionInputs {
  birthDate: string;
  retirementYear: number;
  contributionPeriods: ContributionPeriod[];
}

export interface PensionDetails {
  contributionPoints: number;
  stabilityPoints: number;
  nonContributivePoints: number;
  totalPoints: number;
  totalContributiveYears?: number;
  monthlyPension: number;
  currentAge?: number;
  yearsUntilRetirement?: number;
  error?: string;
}
