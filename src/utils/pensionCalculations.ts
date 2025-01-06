export const REFERENCE_VALUE_2024 = 81.03; // Lei

export const GROUP_II_BONUS = 0.25; // 25% bonus for Group II work
export const GROUP_I_BONUS = 0.50; // 50% bonus for Group I work
export const SPECIAL_CONDITIONS_BONUS = 0.50; // 50% bonus for special conditions

export const MINIMUM_CONTRIBUTION_YEARS = 25; // Changed from 15 to 25 as per new rules
export const TIER1_START = 26;
export const TIER1_END = 30;
export const TIER2_START = 31;
export const TIER2_END = 35;
export const TIER3_START = 36;
export const TIER3_END = 40;

export const TIER1_POINTS = 0.50;
export const TIER2_POINTS = 0.75;
export const TIER3_POINTS = 1.00;

/**
 * Formula de calcul a pensiei de la data de 1 septembrie 2024 este:
 * VPR x Numar total de puncte.
 * VPR (valoarea punctului de referință) = valoarea punctului de pensie (2.032 lei) împartit la 25 = 81 lei.
 * Numar total de puncte = puncte contributivitate + puncte stabilitate + puncte asimilate/necontributive.
 * 
 * 
 * Pensie = VPR (81 lei) x numár total de puncte (puncte de contributivitate + puncte de stabilitate + puncte asimilate / necontributive)
 * 
 * In timp ce VPR are o valoare fixă (la 1 septembrie 2024 este 81 de lei), numărul total de puncte acumulate diferă de la persoană la persoană, 
 * în funcție de venitul brut lunar realizat pe parcursul anilor de muncă, dar și în funcție de punctele de stabilitate ale pensionarului.
 * 
 * Puncte de contributivitate: Reprezintă suma punctajelor anuale acumulate de asigurat pe intreaga perioadă de contribuție la sistemul de pensii.
 * 
 * Punctul de contributivitate se determină lunar prin raportarea veniturilor brute ale asiguratului la salariul mediu brut pe economie 
 * din luna respectivă. Apoi ele se însumează și se împart la 12 pentru a determina punctajul anual.
 */


export type WorkingCondition = 'none' | 'groupI' | 'groupII' | 'special' | 'other';

export interface WorkingPeriod {
  condition: WorkingCondition;
  fromAge: number;
  toAge: number;
}

export interface NonContributivePeriod {
  type: 'military' | 'university' | 'medical' | 'unemployment' | 'disability' | 'childCare';
  years: number;
}

export interface WorkingConditionsResult {
  bonus: number;
  periods: {
    condition: WorkingCondition;
    years: number;
    points: number;
  }[];
}

export const calculateStabilityPoints = (contributionYears: number): number => {
  let totalPoints = 0;

  // No stability points for less than minimum contribution years
  if (contributionYears <= MINIMUM_CONTRIBUTION_YEARS) {
    return 0;
  }

  // Calculate Tier 1 points (26-30 years)
  const tier1Years = Math.min(
    Math.max(0, contributionYears - TIER1_START + 1),
    TIER1_END - TIER1_START + 1
  );
  totalPoints += tier1Years * TIER1_POINTS;

  // Calculate Tier 2 points (31-35 years)
  const tier2Years = Math.min(
    Math.max(0, contributionYears - TIER2_START + 1),
    TIER2_END - TIER2_START + 1
  );
  totalPoints += tier2Years * TIER2_POINTS;

  // Calculate Tier 3 points (36-40 years)
  const tier3Years = Math.min(
    Math.max(0, contributionYears - TIER3_START + 1),
    TIER3_END - TIER3_START + 1
  );
  totalPoints += tier3Years * TIER3_POINTS;

  // Additional years beyond 40 get 1 point each
  const extraYears = Math.max(0, contributionYears - TIER3_END);
  totalPoints += extraYears * TIER3_POINTS;

  return totalPoints;
};

export const calculateWorkingConditionsBonus = (
  workingPeriods: WorkingPeriod[]
): WorkingConditionsResult => {
  if (!workingPeriods || workingPeriods.length === 0) {
    return { bonus: 0, periods: [] };
  }

  const periods = workingPeriods.map(period => {
    const yearsInCondition = period.toAge - period.fromAge;
    const monthsInCondition = yearsInCondition * 12;

    let points = 0;
    switch (period.condition) {
      case 'groupI':
        points = monthsInCondition * GROUP_I_BONUS;
        break;
      case 'groupII':
        points = monthsInCondition * GROUP_II_BONUS;
        break;
      case 'special':
      case 'other':
        points = monthsInCondition * SPECIAL_CONDITIONS_BONUS;
        break;
      default:
        points = 0;
    }

    return {
      condition: period.condition,
      years: yearsInCondition,
      points
    };
  });

  const totalBonus = periods.reduce((sum, period) => sum + period.points, 0);

  return {
    bonus: totalBonus,
    periods: periods.filter(p => p.points > 0)
  };
};

export interface NonContributiveResult {
  total: number;
  periods: {
    type: NonContributivePeriod['type'];
    years: number;
    points: number;
  }[];
}

export const calculateNonContributivePoints = (
  periods: NonContributivePeriod[]
): NonContributiveResult => {
  if (!periods || periods.length === 0) {
    return { total: 0, periods: [] };
  }

  const calculatedPeriods = periods.map(period => {
    let points = 0;
    switch (period.type) {
      case 'military':
      case 'university':
        points = period.years * 0.25; // 0.25 points per year
        break;
      case 'medical':
      case 'unemployment':
      case 'disability':
        points = period.years * 0.15; // 0.15 points per year
        break;
      case 'childCare':
        points = period.years * 0.30; // 0.30 points per year
        break;
    }

    return {
      type: period.type,
      years: period.years,
      points
    };
  });

  return {
    total: calculatedPeriods.reduce((sum, period) => sum + period.points, 0),
    periods: calculatedPeriods.filter(p => p.points > 0)
  };
};

export const calculateMonthlyPension = (
  contributionYears: number,
  contributionPoints: number,
  referenceValue: number,
  workingPeriods: WorkingPeriod[],
  nonContributivePeriods: NonContributivePeriod[] = []
): {
  monthlyPension: number;
  details: {
    basePoints: number;
    stabilityPoints: number;
    workingConditions: WorkingConditionsResult;
    nonContributive: NonContributiveResult;
    total: number;
  };
} => {
  // Calculate stability points for extra contribution years
  const stabilityPoints = calculateStabilityPoints(contributionYears);

  // Calculate points for non-contributive periods
  const nonContributive = calculateNonContributivePoints(nonContributivePeriods);

  // Calculate working conditions bonus
  const workingConditions = calculateWorkingConditionsBonus(workingPeriods);

  // Calculate total points
  const totalPoints = 
    contributionPoints + 
    stabilityPoints + 
    workingConditions.bonus + 
    nonContributive.total;

  return {
    monthlyPension: Math.round(totalPoints * referenceValue * 100) / 100,
    details: {
      basePoints: contributionPoints,
      stabilityPoints,
      workingConditions,
      nonContributive,
      total: totalPoints
    }
  };
};

export const calculateContributionPoints = (
  monthlyGrossSalary: number,
  averageGrossSalary: number
): number => {
  return monthlyGrossSalary / averageGrossSalary;
};