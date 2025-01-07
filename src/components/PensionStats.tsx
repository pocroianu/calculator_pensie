import { Calculator } from 'lucide-react';
import { ContributionPeriod, PensionDetails } from '../types/pensionTypes';

interface Props {
  birthDate: string;
  retirementYear: number;
  contributionPeriods: ContributionPeriod[];
  monthlyPension: number;
  yearlyPension: number;
  pensionDetails: PensionDetails;
  yearsUntilRetirement: number;
}

const REFERENCE_VALUE_2024 = 81.45; // Lei
const AVERAGE_GROSS_SALARY_2024 = 6789; // Lei

const formatCurrency = (value: number) => {
  return `${value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lei`;
};

const PensionStats: React.FC<Props> = ({
  birthDate,
  retirementYear,
  contributionPeriods,
  monthlyPension,
  yearlyPension,
  pensionDetails,
  yearsUntilRetirement
}) => {
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

  const currentAge = getCurrentAge();

  // Calculate average monthly salary
  const getAverageMonthlySalary = () => {
    return contributionPeriods.reduce((sum, period) => sum + (period.monthlyGrossSalary || 0), 0) / 
      Math.max(contributionPeriods.length, 1);
  };

  const averageMonthlySalary = getAverageMonthlySalary();

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
              <span className="text-sm text-gray-600">Years Until Retirement:</span>
              <span className="text-sm font-medium">{yearsUntilRetirement} years</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Retirement age:</span>
              <span className="text-sm font-medium">{65} years</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Points:</span>
              <span className="text-sm font-medium">{pensionDetails.totalPoints.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contribution Points:</span>
              <span className="text-sm font-medium">{pensionDetails.contributionPoints.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stability Points:</span>
              <span className="text-sm font-medium">{pensionDetails.stabilityPoints.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Non-Contributive Points:</span>
              <span className="text-sm font-medium">{pensionDetails.nonContributivePoints}</span>
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