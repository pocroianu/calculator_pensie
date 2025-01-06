export const REFERENCE_VALUE_2024 = 81.03; // Lei
export const SPECIAL_CONDITIONS_BONUS = 0.25; // 25% bonus
export const HAZARDOUS_CONDITIONS_BONUS = 0.50; // 50% bonus

export const calculateMonthlyPension = (
  contributionYears: number,
  contributionPoints: number,
  referenceValue: number,
  hasSpecialConditions: boolean,
  hasHazardousConditions: boolean
): number => {
  let totalPoints = contributionPoints;

  // Add bonuses for special working conditions
  if (hasSpecialConditions) {
    totalPoints *= (1 + SPECIAL_CONDITIONS_BONUS);
  }
  if (hasHazardousConditions) {
    totalPoints *= (1 + HAZARDOUS_CONDITIONS_BONUS);
  }

  // Calculate base pension
  const basePension = totalPoints * referenceValue;

  return Math.round(basePension * 100) / 100;
};

export const calculateContributionPoints = (
  monthlyGrossSalary: number,
  averageGrossSalary: number
): number => {
  return monthlyGrossSalary / averageGrossSalary;
};