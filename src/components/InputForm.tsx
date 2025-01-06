import React from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import { CalculatorInputs } from '../types/calculator';
import { ContributionPeriod } from './ContributionPeriod';
import { PensionInputs, ContributionPeriod as ContributionPeriodType } from '../types/pensionTypes';
import Tooltip from './Tooltip';

interface InputFormProps {
  inputs: PensionInputs;
  onChange: (field: keyof PensionInputs, value: any) => void;
}

const InputForm: React.FC<InputFormProps> = ({ 
  inputs, 
  onChange 
}) => {
  const handleAddPeriod = () => {
    const newPeriod: ContributionPeriodType = {
      fromDate: '',
      toDate: '',
      company: '',
      monthlyGrossSalary: 0,
      workingCondition: 'normal'
    };
    
    onChange('contributionPeriods', [...(inputs.contributionPeriods || []), newPeriod]);
  };

  const handleUpdatePeriod = (index: number, updatedPeriod: ContributionPeriodType) => {
    const newPeriods = [...(inputs.contributionPeriods || [])];
    newPeriods[index] = updatedPeriod;
    onChange('contributionPeriods', newPeriods);
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = (inputs.contributionPeriods || []).filter((_, i) => i !== index);
    onChange('contributionPeriods', newPeriods);
  };

  return (
    <div className="space-y-6">
      {/* Timeline Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Timeline</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
              Birth Date
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="date"
              value={inputs.birthDate}
              onChange={(e) => onChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
              Planned Retirement Year
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="number"
              value={inputs.retirementYear}
              onChange={(e) => onChange('retirementYear', Number(e.target.value))}
              min={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contribution Periods Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Contribution Periods</h2>
          <button
            onClick={handleAddPeriod}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </button>
        </div>

        <div className="space-y-4">
          {(inputs.contributionPeriods || []).map((period, index) => (
            <ContributionPeriod
              key={index}
              period={period}
              onUpdate={(updatedPeriod) => handleUpdatePeriod(index, updatedPeriod)}
              onRemove={() => handleRemovePeriod(index)}
            />
          ))}

          {(!inputs.contributionPeriods || inputs.contributionPeriods.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No contribution periods added yet. Click the "Add Period" button to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;