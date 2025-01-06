import React from 'react';
import { HelpCircle } from 'lucide-react';
import { calculateAge, isRetired } from '../utils/dateCalculations';

interface DateInputsProps {
  birthYear: number;
  retirementYear: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInputs: React.FC<DateInputsProps> = ({ birthYear, retirementYear, onChange }) => {
  const currentAge = calculateAge(birthYear);
  const retired = isRetired(birthYear);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-700">Timeline</h3>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Birth Year
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </label>
          <input
            type="number"
            name="birthYear"
            value={birthYear}
            onChange={onChange}
            max={new Date().getFullYear()}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        {!retired && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Retirement Year
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="retirementYear"
              value={retirementYear}
              onChange={onChange}
              min={new Date().getFullYear()}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        )}

        {retired && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 font-medium">You are already retired!</p>
            <p className="text-sm text-blue-500">This calculation will show your current pension.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateInputs;