import React from 'react';
import { HelpCircle } from 'lucide-react';
import { CalculatorInputs } from '../types/calculator';

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Current Age
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="currentAge"
              value={inputs.currentAge}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Contribution Years
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="contributionYears"
              value={inputs.contributionYears}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Salary Information</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Monthly Gross Salary (Lei)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="monthlyGrossSalary"
              value={inputs.monthlyGrossSalary}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Overtime Hours (Monthly Average)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="overtimeHours"
              value={inputs.overtimeHours}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Working Conditions</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasSpecialConditions"
                checked={inputs.hasSpecialConditions}
                onChange={(e) => onChange({
                  target: {
                    name: e.target.name,
                    value: e.target.checked
                  }
                } as any)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Special Working Conditions</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasHazardousConditions"
                checked={inputs.hasHazardousConditions}
                onChange={(e) => onChange({
                  target: {
                    name: e.target.name,
                    value: e.target.checked
                  }
                } as any)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Hazardous Working Conditions</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;