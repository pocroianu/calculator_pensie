import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PensionChartsProps {
  estimatedPension: number;
  contributionImpact: {
    contributions: number;
    returns: number;
    initial: number;
  };
}

const PensionCharts: React.FC<PensionChartsProps> = ({ contributionImpact }) => {
  const data = {
    labels: ['Your Contributions', 'Investment Returns', 'Initial Savings'],
    datasets: [
      {
        data: [
          contributionImpact.contributions,
          contributionImpact.returns,
          contributionImpact.initial,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pension Breakdown</h3>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PensionCharts;