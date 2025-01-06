import React from 'react';
import { HelpCircle } from 'lucide-react';
import { isRetired } from '../utils/dateCalculations';

interface DateInputsProps {
  birthDate: string;
  retirementYear: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInputs: React.FC<DateInputsProps> = ({ birthDate, retirementYear, onChange }) => {
  const retired = isRetired(new Date(birthDate).getFullYear().toString());

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-gray-700">Timeline</h3>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Birth Date
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </label>
          <input
            type="date"
            name="birthDate"
            value={birthDate}
            onChange={onChange}
            max="2025-01-06"
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