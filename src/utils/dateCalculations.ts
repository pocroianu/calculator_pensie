export const calculateAge = (birthDate: string): number => {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

export const isRetired = (birthDate: string, retirementAge: number = 65): boolean => {
  const currentAge = calculateAge(birthDate);
  return currentAge >= retirementAge;
};