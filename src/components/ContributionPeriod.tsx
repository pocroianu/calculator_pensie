import { HelpCircle, X } from 'lucide-react';
import { ContributionPeriod as ContributionPeriodType, WorkingCondition, NonContributivePeriodType } from '../types/pensionTypes';
import Tooltip from './Tooltip';

interface Props {
  period: ContributionPeriodType;
  onUpdate: (period: ContributionPeriodType) => void;
  onRemove: () => void;
}

export const ContributionPeriod: React.FC<Props> = ({ period, onUpdate, onRemove }) => {
  const handleChange = (field: keyof ContributionPeriodType, value: string | number) => {
    onUpdate({
      ...period,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-700">Employment Period</h4>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Remove period"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
            From Date
            <Tooltip content="Start date of this period" />
          </label>
          <input
            type="date"
            value={period.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
            To Date
            <Tooltip content="End date of this period" />
          </label>
          <input
            type="date"
            value={period.toDate}
            onChange={(e) => handleChange('toDate', e.target.value)}
            min={period.fromDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
          Company
          <Tooltip content="Name of the employer" />
        </label>
        <input
          type="text"
          value={period.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Company name"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
          Monthly Gross Salary (Lei)
          <Tooltip content="Your monthly gross salary during this period" />
        </label>
        <input
          type="number"
          value={period.monthlyGrossSalary}
          onChange={(e) => handleChange('monthlyGrossSalary', Number(e.target.value))}
          min={0}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="5000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
            Working Condition
            <Tooltip content="Type of working conditions during this period" />
          </label>
          <select
            value={period.workingCondition || 'normal'}
            onChange={(e) => handleChange('workingCondition', e.target.value as WorkingCondition)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="special">Special</option>
            <option value="difficult">Difficult</option>
            <option value="veryDifficult">Very Difficult</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
            Non-contributive Type
            <Tooltip content="If this is a non-contributive period, specify the type" />
          </label>
          <select
            value={period.nonContributiveType || ''}
            onChange={(e) => handleChange('nonContributiveType', e.target.value as NonContributivePeriodType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            <option value="military">Military Service</option>
            <option value="university">University Studies</option>
            <option value="childCare">Child Care</option>
            <option value="medical">Medical Leave</option>
          </select>
        </div>
      </div>
    </div>
  );
};
