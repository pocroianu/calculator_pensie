import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Clock, TrendingUp, User } from 'lucide-react';
import { calculateAge, isRetired } from '../utils/dateCalculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PensionStatsProps {
  birthYear: number;
  yearsUntilRetirement: number;
  contributionYears: number;
  hasSpecialConditions: boolean;
  hasHazardousConditions: boolean;
}

const PensionStats: React.FC<PensionStatsProps> = ({
  birthYear,
  yearsUntilRetirement,
  contributionYears,
  hasSpecialConditions,
  hasHazardousConditions,
}) => {
  const currentAge = calculateAge(birthYear);
  const retired = isRetired(birthYear);

  const bonusData = {
    labels: ['Base Pension', 'Special Conditions Bonus', 'Hazardous Conditions Bonus'],
    datasets: [
      {
        data: [
          100,
          hasSpecialConditions ? 25 : 0,
          hasHazardousConditions ? 50 : 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-700">Pension Statistics</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Current Age</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{currentAge}</p>
        </div>

        {!retired && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Years Until Retirement</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{yearsUntilRetirement}</p>
          </div>
        )}
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Contribution Years</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{contributionYears}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Pension Bonus Breakdown</h4>
        <div className="w-full max-w-md mx-auto">
          <Pie data={bonusData} />
        </div>
      </div>
    </div>
  );
};

export default PensionStats;