import { X } from 'lucide-react';
import { ContributionPeriod as ContributionPeriodType, WorkingCondition, NonContributivePeriodType } from '../types/pensionTypes';
import Tooltip from './Tooltip';
import { useMemo } from 'react';

interface Props {
  period: ContributionPeriodType;
  onUpdate: (period: ContributionPeriodType) => void;
  onRemove: () => void;
}

const ContributionPeriod: React.FC<Props> = ({ period, onUpdate, onRemove}) => {
  const handleChange = (
    field: keyof ContributionPeriodType,
    value: typeof field extends 'nonContributiveType' ? NonContributivePeriodType : string | number
  ) => {
    if (field === 'nonContributiveType') {
      // Reset salary and working condition when switching to non-contributive
      if (value) {
        onUpdate({
          ...period,
          [field as NonContributivePeriodType]: value,
          monthlyGrossSalary: 0,
          workingCondition: 'normal'
        });
      } else {
        onUpdate({
          ...period,
          [field as NonContributivePeriodType]: value
        });
      }
    } else {
      onUpdate({
        ...period,
        [field]: value,
      });
    }
  };

  const cardStyle = useMemo(() => {
    if (!period.nonContributiveType) {
      return 'bg-white';
    }
    switch (period.nonContributiveType) {
      case 'military':
        return 'bg-blue-50';
      case 'university':
        return 'bg-purple-50';
      case 'childCare':
        return 'bg-pink-50';
      case 'medical':
        return 'bg-green-50';
      default:
        return 'bg-white';
    }
  }, [period.nonContributiveType]);

  return (
    <div className={`${cardStyle} rounded-xl shadow-lg p-4 space-y-4 transition-colors duration-200`}>
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-700">
          {period.nonContributiveType ? 'Non-contributive Period' : 'Employment Period'}
        </h4>
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
          Type
          <Tooltip content="Select whether this is a regular employment or non-contributive period" />
        </label>
        <select
          value={period.nonContributiveType || ''}
          onChange={(e) => handleChange('nonContributiveType', e.target.value as NonContributivePeriodType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Regular Employment</option>
          <option value="military">Military Service</option>
          <option value="university">University Studies</option>
          <option value="childCare">Child Care</option>
          <option value="medical">Medical Leave</option>
        </select>
      </div>

      {!period.nonContributiveType && (
        <>
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

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
              Working Condition
              <Tooltip content="Type of working conditions during this period" />
            </label>
            <select
              value={period.workingCondition}
              onChange={(e) => handleChange('workingCondition', e.target.value as WorkingCondition)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="special">Special</option>
              <option value="difficult">Difficult</option>
              <option value="veryDifficult">Very Difficult</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default ContributionPeriod;