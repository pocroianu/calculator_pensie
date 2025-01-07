import React from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Briefcase } from 'lucide-react';
import { PensionDetails, ContributionPeriod, PensionInputs } from '../types/pensionTypes';
import { RETIREMENT_AGE, MINIMUM_CONTRIBUTION_YEARS, COMPLETE_CONTRIBUTION_YEARS } from '../utils/pensionCalculations';
import { format } from 'date-fns';

interface Props {
  pensionDetails: PensionDetails;
  inputs: PensionInputs;
}

const PensionStats: React.FC<Props> = ({ 
  pensionDetails,
  inputs 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate points for each period
  const calculatePeriodPoints = (period: ContributionPeriod) => {
    if (!period.fromDate || !period.toDate) return 0;
    
    const years = (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (period.nonContributiveType) {
      switch (period.nonContributiveType) {
        case 'military':
        case 'university':
        case 'childCare':
          return years * 0.25; // 0.25 points per year
        case 'medical':
          return years * 0.20; // 0.20 points per year
        default:
          return 0;
      }
    } else if (period.monthlyGrossSalary) {
      // Use 2024 average salary
      const pointsPerYear = period.monthlyGrossSalary / 6789;
      return years * pointsPerYear;
    }
    
    return 0;
  };

  const getValidationStatus = () => {
    if (pensionDetails.error) {
      return {
        type: 'error',
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        message: pensionDetails.error,
        color: 'bg-red-50 border-red-200'
      };
    }

    if (!inputs.contributionPeriods?.length) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        message: 'Add your contribution periods to calculate your pension',
        color: 'bg-yellow-50 border-yellow-200'
      };
    }

    const contributivePeriods = inputs.contributionPeriods.filter(p => !p.nonContributiveType);
    const totalContributiveYears = contributivePeriods.reduce((sum, period) => {
      if (!period.fromDate || !period.toDate) return sum;
      const years = (new Date(period.toDate).getTime() - new Date(period.fromDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return sum + years;
    }, 0);

    if (totalContributiveYears < MINIMUM_CONTRIBUTION_YEARS) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        message: `You need ${Math.ceil(MINIMUM_CONTRIBUTION_YEARS - totalContributiveYears)} more years to reach the minimum contribution period of ${MINIMUM_CONTRIBUTION_YEARS} years`,
        color: 'bg-yellow-50 border-yellow-200'
      };
    }

    if (totalContributiveYears < COMPLETE_CONTRIBUTION_YEARS) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        message: `You need ${Math.ceil(COMPLETE_CONTRIBUTION_YEARS - totalContributiveYears)} more years to reach the complete contribution period of ${COMPLETE_CONTRIBUTION_YEARS} years`,
        color: 'bg-yellow-50 border-yellow-200'
      };
    }

    return {
      type: 'success',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      message: 'All pension conditions are met',
      color: 'bg-green-50 border-green-200'
    };
  };

  const validationStatus = getValidationStatus();

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`p-4 rounded-xl border ${validationStatus.color}`}>
        <div className="flex items-start gap-3">
          {validationStatus.icon}
          <p className="text-sm">{validationStatus.message}</p>
        </div>
      </div>

      {/* Retirement Status */}
      <div className={`${pensionDetails.yearsUntilRetirement <= 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} p-4 rounded-xl border`}>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-medium">Retirement Status</h3>
            <p className="text-sm">
              {pensionDetails.yearsUntilRetirement <= 0
                ? `Eligible for retirement`
                : `${pensionDetails.yearsUntilRetirement} years remaining`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">Timeline</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Age</div>
                  <div className="text-lg font-medium">{pensionDetails.currentAge} years</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Retirement Age</div>
                  <div className="text-lg font-medium">{RETIREMENT_AGE} years</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Contribution Progress</span>
                  <span>{Math.round(pensionDetails.totalContributiveYears || 0)} / {COMPLETE_CONTRIBUTION_YEARS} YEARS</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${((pensionDetails.totalContributiveYears || 0) / COMPLETE_CONTRIBUTION_YEARS) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Points Breakdown Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">Points Breakdown</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contribution</span>
                  <span className="text-sm font-medium">{pensionDetails.contributionPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stability</span>
                  <span className="text-sm font-medium">{pensionDetails.stabilityPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Non-contributive</span>
                  <span className="text-sm font-medium">{pensionDetails.nonContributivePoints?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-4">
                <span className="text-sm font-medium text-gray-900">Total Points</span>
                <span className="text-sm font-bold text-blue-600">{pensionDetails.totalPoints.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Period Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <h2 className="font-medium text-gray-900">Period Breakdown</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {inputs.contributionPeriods?.map((period, index) => {
                const startDate = new Date(period.fromDate);
                const endDate = new Date(period.toDate);
                const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                const points = calculatePeriodPoints(period);
                const pointPercentage = pensionDetails.totalPoints > 0 ? (points / pensionDetails.totalPoints) * 100 : 0;
                const isContributive = !period.nonContributiveType;

                return (
                  <div key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {isContributive ? (
                            <Briefcase className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-500" />
                          )}
                          <h3 className="font-medium text-gray-900">
                            {isContributive ? period.company : period.nonContributiveType}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {points.toFixed(2)} points
                        </div>
                        <div className="text-sm text-gray-500">
                          {years.toFixed(1)} years
                        </div>
                      </div>
                    </div>

                    {isContributive && (
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Monthly Salary:</span>{' '}
                          {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(period.monthlyGrossSalary || 0)}
                        </div>
                        <div>
                          <span className="font-medium">Working Condition:</span>{' '}
                          {period.workingCondition}
                        </div>
                      </div>
                    )}

                    {!isContributive && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Non-contributive Type:</span>{' '}
                        {period.nonContributiveType}
                      </div>
                    )}

                    <div className="mt-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            isContributive ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{
                            width: `${pointPercentage}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {pointPercentage.toFixed(1)}% of total points
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!inputs.contributionPeriods || inputs.contributionPeriods.length === 0) && (
                <div className="p-6 text-center text-gray-500">
                  No contribution periods added yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Pension Estimate */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg border border-blue-400 overflow-hidden min-w-[280px]">
            <div className="p-4 border-b border-blue-400/30 bg-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <h2 className="font-medium text-white">Pension Estimate</h2>
              </div>
            </div>

            <div className="p-6">
              {pensionDetails.monthlyPension > 0 ? (
                <>
                  <div className="text-center">
                    <div className="text-sm text-blue-100 mb-2">Monthly Pension</div>
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1 whitespace-nowrap">
                      {formatCurrency(pensionDetails.monthlyPension)}
                    </div>
                    <div className="text-xs text-blue-200">
                      Based on {pensionDetails.totalPoints.toFixed(2)} total points
                    </div>
                  </div>
                  <div className="text-center mt-6 pt-4 border-t border-blue-400/30">
                    <div className="text-sm text-blue-100 mb-2">Yearly Pension</div>
                    <div className="text-xl lg:text-2xl font-semibold text-white whitespace-nowrap">
                      {formatCurrency(pensionDetails.monthlyPension * 12)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-white/90 max-w-[240px] mx-auto">
                    {pensionDetails.error || 'Complete the minimum contribution period to see your estimated pension'}
                  </p>
                </div>
              )}
              <div className="text-xs text-center text-blue-100/80 pt-4 border-t border-blue-400/30 mt-4">
                Based on the 2024 Romanian pension calculation formula
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionStats;