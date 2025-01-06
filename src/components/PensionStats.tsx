import { Calculator } from 'lucide-react';
import { ContributionPeriod } from '../types/pensionTypes';

interface Props {
  birthDate: string;
  retirementYear: number;
  contributionPeriods: ContributionPeriod[];
}

const REFERENCE_VALUE_2024 = 81.45; // Lei
const AVERAGE_GROSS_SALARY_2024 = 6789; // Lei

const formatCurrency = (value: number) => {
  return `${value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lei`;
};

const PensionStats: React.FC<Props> = ({
  birthDate,
  retirementYear,
  contributionPeriods = []
}) => {
  // Calculate total contribution years
  const getTotalYears = (periods: ContributionPeriod[]) => {
    if (!periods) return 0;
    return periods.reduce((total, period) => {
      if (!period.fromDate || !period.toDate) return total;
      const start = new Date(period.fromDate);
      const end = new Date(period.toDate);
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return total + years;
    }, 0);
  };

  // Calculate current age
  const getCurrentAge = () => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate contribution points for a period
  const getContributionPoints = (grossSalary: number) => {
    return grossSalary / AVERAGE_GROSS_SALARY_2024;
  };

  // Calculate total contribution points
  const getTotalPoints = () => {
    return contributionPeriods.reduce((total, period) => {
      if (!period.monthlyGrossSalary) return total;
      const points = getContributionPoints(period.monthlyGrossSalary);
      const years = period.fromDate && period.toDate ? 
        (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0;
      return total + (points * years * 12); // multiply by 12 for monthly points
    }, 0);
  };

  const currentAge = getCurrentAge();
  const yearsUntilRetirement = retirementYear - new Date().getFullYear();
  const contributionYears = getTotalYears(contributionPeriods);
  const totalPoints = getTotalPoints();

  // Calculate average monthly salary
  const getAverageMonthlySalary = () => {
    if (!contributionPeriods || contributionPeriods.length === 0) return 0;
    const totalSalary = contributionPeriods.reduce((sum, period) => sum + (period.monthlyGrossSalary || 0), 0);
    return totalSalary / contributionPeriods.length;
  };

  const averageMonthlySalary = getAverageMonthlySalary();

  // Calculate monthly pension
  const calculateMonthlyPension = () => {
    // Basic formula: Total Points * Reference Value
    let monthlyPension = totalPoints * REFERENCE_VALUE_2024;

    // Apply working conditions bonuses
    contributionPeriods.forEach(period => {
      if (period.workingCondition) {
        const years = period.fromDate && period.toDate ? 
          (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0;
        
        switch (period.workingCondition) {
          case 'special':
          case 'groupI':
            monthlyPension *= (1 + 0.5 * years / contributionYears); // 50% bonus
            break;
          case 'groupII':
            monthlyPension *= (1 + 0.25 * years / contributionYears); // 25% bonus
            break;
        }
      }
    });

    // Apply stability bonus for extra years
    if (contributionYears > 25) {
      const extraYears = contributionYears - 25;
      let stabilityBonus = 0;
      
      if (extraYears > 0) {
        // 0.5 points per year for years 26-30
        stabilityBonus += Math.min(extraYears, 5) * 0.5;
        
        if (extraYears > 5) {
          // 0.75 points per year for years 31-35
          stabilityBonus += Math.min(extraYears - 5, 5) * 0.75;
          
          if (extraYears > 10) {
            // 1 point per year for years 36+
            stabilityBonus += (extraYears - 10) * 1;
          }
        }
      }
      
      monthlyPension += stabilityBonus * REFERENCE_VALUE_2024;
    }

    return monthlyPension;
  };

  const monthlyPension = calculateMonthlyPension();
  const yearlyPension = monthlyPension * 12;

  return (
    <div className="space-y-4">
      {/* Estimated Pension Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Estimated Pension</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Monthly Pension</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{formatCurrency(monthlyPension)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Yearly Pension</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-500">{formatCurrency(yearlyPension)}</div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            *Based on the 2024 Romanian pension calculation formula
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg divide-y divide-gray-100">
        {/* Personal Timeline section */}
        <div className="py-4 first:pt-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Personal Timeline</h3>
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Age:</span>
              <span className="text-sm font-medium">{currentAge} years</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contribution Period:</span>
              <span className="text-sm font-medium">{contributionYears.toFixed(1)} years</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Years Until Retirement:</span>
              <span className="text-sm font-medium">{yearsUntilRetirement} years</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Points:</span>
              <span className="text-sm font-medium">{totalPoints.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Contribution Details section */}
        <div className="py-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Contribution Details</h3>
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Monthly Salary:</span>
              <span className="text-sm font-medium">{formatCurrency(averageMonthlySalary)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Periods:</span>
              <span className="text-sm font-medium">{contributionPeriods?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Contribution Periods section */}
        <div className="py-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Contribution Periods</h3>
          <div className="space-y-3">
            {contributionPeriods?.map((period, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{period.company || 'Unnamed Company'}</span>
                  <span className="text-sm text-gray-600">{formatCurrency(period.monthlyGrossSalary || 0)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {period.fromDate ? new Date(period.fromDate).toLocaleDateString() : 'Start Date'} - 
                  {period.toDate ? new Date(period.toDate).toLocaleDateString() : 'End Date'}
                </div>
                {period.workingCondition && period.workingCondition !== 'normal' && (
                  <div className="mt-1 text-xs font-medium text-amber-600">
                    {period.workingCondition} conditions
                  </div>
                )}
                {period.nonContributiveType && (
                  <div className="mt-1 text-xs font-medium text-purple-600">
                    {period.nonContributiveType} period
                  </div>
                )}
              </div>
            ))}

            {(!contributionPeriods || contributionPeriods.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                No contribution periods added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionStats;