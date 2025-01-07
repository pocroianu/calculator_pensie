import { ContributionPeriod, PensionDetails } from "../types/pensionTypes";

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

export const calculateMonthlyPension = (
  contributionPeriods: ContributionPeriod[],
  birthDate: string,
): {
  monthlyPension: number;
  details: PensionDetails;
} => {
  let totalPoints = 0;
  let contributionPoints = 0;
  let stabilityPoints = 0;
  let nonContributivePoints = 0;

  // Calculate contribution points and non-contributive points
  contributionPeriods.forEach((period: ContributionPeriod) => {
    if (period.nonContributiveType) {
      // Handle non-contributive periods
      let numberOfYears = period.fromDate && period.toDate ? 
        (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0;
      
      switch (period.nonContributiveType) {
        case 'military':
        case 'university':
          nonContributivePoints += numberOfYears * 0.25; // 0.25 points per year
          break;
        case 'medical':
          nonContributivePoints += numberOfYears * 0.20; // 0.20 points per year
          break;
        case 'childCare':
          nonContributivePoints += numberOfYears * 0.25; // 0.30 points per year
          break;
      }
    } else {
      // Handle regular contribution periods
      let point = calculateContributionPoint(period.monthlyGrossSalary, AVERAGE_GROSS_SALARY_2024);
      let numberOfYears = period.fromDate && period.toDate ? 
        (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0;
      contributionPoints += point * numberOfYears;
    }
  });

  // Calculate stability points
  stabilityPoints = calculateStabilityPoints(
    contributionPeriods.filter(p => !p.nonContributiveType), // Only consider contributive periods
    birthDate
  );

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

export const calculateContributionPoint = (
  monthlyGrossSalary: number,
  averageGrossSalary: number
): number => {
  return monthlyGrossSalary / averageGrossSalary;
};

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