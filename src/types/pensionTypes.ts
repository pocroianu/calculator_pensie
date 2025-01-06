export type WorkingCondition = 'normal' | 'special' | 'difficult' | 'veryDifficult';
export type NonContributivePeriodType = 'military' | 'university' | 'childCare' | 'medical';

export interface ContributionPeriod {
  fromDate: string;
  toDate: string;
  company: string;
  monthlyGrossSalary: number;
  workingCondition?: WorkingCondition;
  nonContributiveType?: NonContributivePeriodType;
}

export interface PensionInputs {
  birthDate: string;
  retirementYear: number;
  contributionPeriods: ContributionPeriod[];
}

export interface PensionDetails {
  basePoints: number;
  stabilityPoints: number;
  workingConditions: {
    points: number;
    periods: Array<{
      condition: WorkingCondition;
      years: number;
      points: number;
    }>;
  };
  nonContributive: {
    points: number;
    periods: Array<{
      type: NonContributivePeriodType;
      years: number;
      points: number;
    }>;
  };
}
