import React from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import { CalculatorInputs } from '../types/calculator';

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddWorkingPeriod: () => void;
  onRemoveWorkingPeriod: (index: number) => void;
}

const InputForm: React.FC<InputFormProps> = ({ 
  inputs, 
  onChange, 
  onAddWorkingPeriod,
  onRemoveWorkingPeriod 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
        <div className="space-y-4">
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Working Conditions</h3>
          <button
            type="button"
            onClick={onAddWorkingPeriod}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </button>
        </div>
        
        {inputs.workingPeriods.map((period, index) => (
          <div key={index} className="space-y-4 border-b border-gray-200 pb-6 last:border-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Working Period {index + 1}</h4>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onRemoveWorkingPeriod(index)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                Working Conditions Type
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </label>
              <select
                name={`workingPeriods[${index}].condition`}
                value={period.condition}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="none">Normal Working Conditions</option>
                <option value="groupI">Group I Work (50% bonus)</option>
                <option value="groupII">Group II Work (25% bonus)</option>
                <option value="special">Special Conditions (50% bonus)</option>
                <option value="other">Other Conditions (50% bonus)</option>
              </select>
            </div>

            {period.condition !== 'none' && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    From Age
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    type="number"
                    name={`workingPeriods[${index}].fromAge`}
                    value={period.fromAge}
                    onChange={onChange}
                    min="14"
                    max="70"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    To Age
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    type="number"
                    name={`workingPeriods[${index}].toAge`}
                    value={period.toAge}
                    onChange={onChange}
                    min={period.fromAge}
                    max="70"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Non-contributive Periods</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Military Service (Years)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="militaryYears"
              value={inputs.militaryYears || 0}
              onChange={onChange}
              min="0"
              max="5"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              University Studies (Years)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="universityYears"
              value={inputs.universityYears || 0}
              onChange={onChange}
              min="0"
              max="6"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Child Care Leave (Years)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="childCareYears"
              value={inputs.childCareYears || 0}
              onChange={onChange}
              min="0"
              max="10"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              Medical Leave (Years)
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              name="medicalYears"
              value={inputs.medicalYears || 0}
              onChange={onChange}
              min="0"
              max="5"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;