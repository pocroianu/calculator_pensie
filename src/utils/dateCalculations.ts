export const calculateAge = (birthYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

export const isRetired = (birthYear: number, retirementAge: number = 65): boolean => {
  const currentAge = calculateAge(birthYear);
  return currentAge >= retirementAge;
};