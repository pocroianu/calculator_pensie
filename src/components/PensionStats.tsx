import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { calculateAge, isRetired } from '../utils/dateCalculations';
import { WorkingPeriod, NonContributiveResult, WorkingConditionsResult } from '../utils/pensionCalculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PensionStatsProps {
  birthDate: string;
  contributionYears: number;
  workingPeriods: WorkingPeriod[];
  monthlyGrossSalary: number;
  yearsUntilRetirement: number;
  contributionPoints: number;
  referenceValue: number;
  monthlyPension: number;
  yearlyPension: number;
  pensionDetails: {
    basePoints: number;
    stabilityPoints: number;
    workingConditions: WorkingConditionsResult;
    nonContributive: NonContributiveResult;
    total: number;
  };
}

const PensionStats: React.FC<PensionStatsProps> = ({
  birthDate,
  contributionYears,
  workingPeriods,
  monthlyGrossSalary,
  yearsUntilRetirement,
  contributionPoints,
  referenceValue,
  monthlyPension,
  yearlyPension,
  pensionDetails
}) => {
  const currentAge = calculateAge(birthDate);
  const retired = isRetired(birthDate);
  const totalPoints = pensionDetails.total;

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number = 0, decimals: number = 2) => {
    return Number(num).toFixed(decimals);
  };

  const getWorkingConditionLabel = (condition: string) => {
    switch (condition) {
      case 'groupI':
        return 'Group I Work (+50%)';
      case 'groupII':
        return 'Group II Work (+25%)';
      case 'special':
        return 'Special Conditions (+50%)';
      case 'other':
        return 'Other Conditions (+50%)';
      default:
        return null;
    }
  };

  const getNonContributiveLabel = (type: string) => {
    switch (type) {
      case 'military':
        return 'Military Service';
      case 'university':
        return 'University Studies';
      case 'medical':
        return 'Medical Leave';
      case 'unemployment':
        return 'Unemployment';
      case 'disability':
        return 'Disability';
      case 'childCare':
        return 'Child Care';
      default:
        return type;
    }
  };

  // Prepare data for the doughnut chart
  const chartData = {
    labels: [
      'Base Points',
      pensionDetails.stabilityPoints > 0 ? 'Stability Points' : null,
      ...pensionDetails.workingConditions.periods.map(p => 
        `${getWorkingConditionLabel(p.condition)} (${p.years} years)`
      ),
      ...pensionDetails.nonContributive.periods.map(p => 
        `${getNonContributiveLabel(p.type)} (${p.years} years)`
      )
    ].filter(Boolean),
    datasets: [{
      data: [
        pensionDetails.basePoints,
        pensionDetails.stabilityPoints,
        ...pensionDetails.workingConditions.periods.map(p => p.points),
        ...pensionDetails.nonContributive.periods.map(p => p.points)
      ].filter(points => points > 0),
      backgroundColor: [
        'rgb(59, 130, 246)', // Base points - blue
        'rgb(16, 185, 129)', // Stability points - green
        // Working conditions - amber shades
        'rgb(245, 158, 11)',
        'rgb(217, 119, 6)',
        'rgb(180, 83, 9)',
        // Non-contributive - purple shades
        'rgb(139, 92, 246)',
        'rgb(124, 58, 237)',
        'rgb(109, 40, 217)'
      ]
    }]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
      {/* Personal Timeline section - unchanged */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Timeline</h3>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Age:</span>
            <span className="font-medium">{currentAge} years</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Contribution Period:</span>
            <span className="font-medium">{contributionYears} years</span>
          </div>

          {!retired && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Years Until Retirement:</span>
              <span className="font-medium">{yearsUntilRetirement} years</span>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Details section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Contribution Details</h3>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Gross Salary:</span>
            <span className="font-medium">{formatCurrency(monthlyGrossSalary)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Contribution Points:</span>
            <span className="font-medium">
              {formatNumber(totalPoints / (contributionYears * 12), 4)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Base Contribution Points:</span>
            <span className="font-medium">{formatNumber(pensionDetails.basePoints)}</span>
          </div>
        </div>
      </div>

      {/* Working Conditions section */}
      {pensionDetails.workingConditions.periods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Working Conditions</h3>
          <div className="space-y-4">
            {pensionDetails.workingConditions.periods.map((period, index) => (
              <div key={index} className="p-4 bg-amber-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-800">
                    {getWorkingConditionLabel(period.condition)}
                  </span>
                  <span className="text-sm text-amber-600">
                    {period.years} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-600">Bonus Points:</span>
                  <span className="font-medium text-amber-600">
                    +{formatNumber(period.points)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-contributive Periods section */}
      {pensionDetails.nonContributive.periods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Non-contributive Periods</h3>
          <div className="space-y-4">
            {pensionDetails.nonContributive.periods.map((period, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-800">
                    {getNonContributiveLabel(period.type)}
                  </span>
                  <span className="text-sm text-purple-600">
                    {period.years} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-600">Points:</span>
                  <span className="font-medium text-purple-600">
                    +{formatNumber(period.points)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stability Bonus section */}
      {pensionDetails.stabilityPoints > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Stability Bonus</h3>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Extra Years:</span>
              <span className="font-medium">{contributionYears - 25} years</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stability Points:</span>
              <span className="font-medium text-green-600">+{formatNumber(pensionDetails.stabilityPoints)}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Breakdown:</span><br />
                • 0.50 points/year for years 26-30<br />
                • 0.75 points/year for years 31-35<br />
                • 1.00 points/year for years 36-40<br />
                • 1.00 points/year for years beyond 40
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final Pension Calculation section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Pension Calculation</h3>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Points:</span>
            <span className="font-medium">{formatNumber(totalPoints)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Reference Value:</span>
            <span className="font-medium">{formatCurrency(referenceValue)}</span>
          </div>

          <div className="h-px bg-gray-200 my-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Monthly Pension:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(monthlyPension)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Yearly Pension:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(yearlyPension)}</span>
          </div>
        </div>
      </div>

      {/* Points Distribution chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Points Distribution</h3>
        <div className="w-full h-64">
          <Doughnut data={chartData} options={{ 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 12
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.formattedValue || '0';
                    return `${label}: ${value} points`;
                  }
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Calculation Formula section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation Formula</h4>
        <p className="text-sm text-gray-600">
          Monthly Pension = Total Points × Reference Value<br /><br />
          Where Total Points = Base Points + Stability Points + Working Conditions Points + Non-contributive Points<br /><br />
          • Base Points = Monthly Points × Contribution Years × 12<br />
          • Monthly Points = Monthly Gross Salary ÷ Average Gross Salary<br />
          • Stability Points = Additional points for years beyond 25 years of contribution<br />
          • Working Conditions Points = Additional points based on special working conditions<br />
          • Non-contributive Points = Points for periods like military service, university, etc.
        </p>
      </div>
    </div>
  );
};

export default PensionStats;