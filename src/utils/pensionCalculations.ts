import { ContributionPeriod } from "../types/pensionTypes";

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

const AVERAGE_GROSS_SALARY_2024 = 6789; // Lei

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

export const calculateStabilityPoints = (
  contributionPeriods: ContributionPeriod[],
  birthDate: string
): number => {
  let totalPoints = 0;
  
  // Sort periods by date
  const sortedPeriods = [...contributionPeriods].sort((a, b) => 
    new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()
  );

  // Calculate total contribution years and the age at which they occurred
  let totalYears = 0;
  sortedPeriods.forEach(period => {
    if (!period.fromDate || !period.toDate) return;
    
    const start = new Date(period.fromDate);
    const end = new Date(period.toDate);
    const startAge = start.getFullYear() - new Date(birthDate).getFullYear();
    const endAge = end.getFullYear() - new Date(birthDate).getFullYear();
    
    // Calculate years for each tier based on age
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    totalYears += years;

    // No points before minimum years
    if (totalYears <= MINIMUM_CONTRIBUTION_YEARS) return;

    // Calculate points for each tier
    if (startAge >= 25) {
      // Tier 1 (26-30 years)
      if (startAge < 30) {
        const tier1Years = Math.min(years, 30 - startAge);
        totalPoints += tier1Years * TIER1_POINTS;
      }
      
      // Tier 2 (31-35 years)
      if (startAge < 35 && endAge >= 31) {
        const tier2Years = Math.min(
          years,
          Math.min(35, endAge) - Math.max(31, startAge)
        );
        totalPoints += tier2Years * TIER2_POINTS;
      }
      
      // Tier 3 (36+ years)
      if (endAge >= 36) {
        const tier3Years = endAge - Math.max(36, startAge);
        totalPoints += tier3Years * TIER3_POINTS;
      }
    }
  });

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



/**
 * Exemplu de calcul al pensiei: 
 * Domnul Popescu, pensionar cu un stagiu de cotizare de 35 ani, a activat în condiții normale de muncă. 
 * Pe lângă cei 35 de ani de lucru efectiv, el are și 4 ani de facultate, iar timp de 1 an a fost în șomaj.
 * 
 * Salariul mediu pe durata activității: 4.274 lei brut (2.500 lei net)
 * Puncte de contributivitate: 35 x 0,64 (media anuală) = 22,4
 * Puncte de stabilitate: 0,5 x 5 (ani munciți peste 25) + 0,75 x 5 (ani munciți peste 30) = 6,25
 * Puncte asimilate / necontributive: 5 (facultate și șomaj) x 0,25 = 1,25
 * Număr total puncte: 22,4 + 6,25 + 1,25 = 29,9
 * Sumă pensie: 81 lei (VPR) x 29,9 = 2.422 lei
 * 
 * Din pensia totală, suma ce depășește 2.000 lei se impoziteaza cu 10%. Prin urmare, după aplicarea taxei pentru cei 422 lei ce depășesc pragul, 
 * suma pe care pensionarul o va primi efectiv este de 2.380 lei. Insa, Ministerul Muncii a anunțat că de la 1 octombrie 2024, 
 * pensiile de până la 3.000 lei nu vor mai fi impozitate și doar pentru suma ce depășește plafonul de 3.000 se va aplica impozitul de 10%.
 * 
 */
export const calculateMonthlyPension = (
  contributionPeriods: ContributionPeriod[],
  birthDate: string,
): {
  monthlyPension: number;
  details: {
    contributionPoints: number;
    stabilityPoints: number;
    totalPoints: number;
    nonContributivePoints: number;
  };
} => {
  let totalPoints = 0;
  let contributionPoints = 0;
  let stabilityPoints = 0;
  let nonContributivePoints = 0;

  // Calculate contribution points
  contributionPeriods.forEach((period: ContributionPeriod) => {
    let point = calculateContributionPoint(period.monthlyGrossSalary, AVERAGE_GROSS_SALARY_2024);
    let numberOfMonths = period.fromDate && period.toDate ? 
      (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0;
    contributionPoints += point * numberOfMonths;  
  });

  // Calculate stability points
  stabilityPoints = calculateStabilityPoints(contributionPeriods, birthDate);

  totalPoints = 
    contributionPoints + 
    stabilityPoints +
    nonContributivePoints;

  return {
    monthlyPension: Math.round(totalPoints * 81),
    details: {
      contributionPoints,
      stabilityPoints,
      totalPoints,
      nonContributivePoints
    }
  };
};

export const calculateContributionPoints = (
  monthlyGrossSalary: number,
  averageGrossSalary: number
): number => {
  return monthlyGrossSalary / averageGrossSalary;
};

export const calculateContributionPoint = (
  monthlyGrossSalary: number,
  averageGrossSalary: number
): number => {
  return monthlyGrossSalary / averageGrossSalary;
};