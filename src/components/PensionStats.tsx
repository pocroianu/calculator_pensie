import React from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Briefcase } from 'lucide-react';
import { PensionDetails, ContributionPeriod, PensionInputs } from '../types/pensionTypes';
import { RETIREMENT_AGE, MINIMUM_CONTRIBUTION_YEARS, COMPLETE_CONTRIBUTION_YEARS } from '../utils/pensionCalculations';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Props {
  pensionDetails: PensionDetails;
  inputs: PensionInputs;
}

const PensionStats: React.FC<Props> = ({ 
  pensionDetails,
  inputs 
}) => {
  const { t } = useTranslation();

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
        message: t('pension.stats.validation.noContributionPeriods'),
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
        message: t('pension.stats.validation.minimumContributionYears', { years: Math.ceil(MINIMUM_CONTRIBUTION_YEARS - totalContributiveYears), minimum: MINIMUM_CONTRIBUTION_YEARS }),
        color: 'bg-yellow-50 border-yellow-200'
      };
    }

    if (totalContributiveYears < COMPLETE_CONTRIBUTION_YEARS) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        message: t('pension.stats.validation.completeContributionYears', { years: Math.ceil(COMPLETE_CONTRIBUTION_YEARS - totalContributiveYears), complete: COMPLETE_CONTRIBUTION_YEARS }),
        color: 'bg-yellow-50 border-yellow-200'
      };
    }

    return {
      type: 'success',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      message: t('pension.stats.validation.allConditionsMet'),
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
            <h3 className="font-medium">{t('pension.stats.retirementStatus.title')}</h3>
            <p className="text-sm">
              {pensionDetails.yearsUntilRetirement <= 0
                ? t('pension.stats.retirementStatus.eligible')
                : t('pension.stats.retirementStatus.yearsRemaining', { years: pensionDetails.yearsUntilRetirement })
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
                <h3 className="font-medium text-gray-900">{t('pension.stats.timeline.title')}</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t('pension.stats.timeline.currentAge')}</div>
                  <div className="text-lg font-medium">{pensionDetails.currentAge} {t('pension.stats.timeline.years')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t('pension.stats.timeline.retirementAge')}</div>
                  <div className="text-lg font-medium">{RETIREMENT_AGE} {t('pension.stats.timeline.years')}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t('pension.stats.contributionProgress.title')}</span>
                  <span>{Math.round(pensionDetails.totalContributiveYears || 0)} / {COMPLETE_CONTRIBUTION_YEARS} {t('pension.stats.contributionProgress.years')}</span>
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
                <h3 className="font-medium text-gray-900">{t('pension.stats.pointsBreakdown.title')}</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('pension.stats.pointsBreakdown.contribution')}</span>
                  <span className="text-sm font-medium">{pensionDetails.contributionPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('pension.stats.pointsBreakdown.stability')}</span>
                  <span className="text-sm font-medium">{pensionDetails.stabilityPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('pension.stats.pointsBreakdown.nonContributive')}</span>
                  <span className="text-sm font-medium">{pensionDetails.nonContributivePoints?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-4">
                <span className="text-sm font-medium text-gray-900">{t('pension.stats.pointsBreakdown.totalPoints')}</span>
                <span className="text-sm font-bold text-blue-600">{pensionDetails.totalPoints.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Period Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <h2 className="font-medium text-gray-900">{t('pension.stats.periodBreakdown.title')}</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {inputs.contributionPeriods?.map((period, index) => {
                if (!period.fromDate || !period.toDate) return null;
                
                const startDate = new Date(period.fromDate);
                const endDate = new Date(period.toDate);
                
                // Validate dates
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
                
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
                            {isContributive ? period.company : t(`pension.contributionPeriods.nonContributivePeriod.${period.nonContributiveType}`)}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {points.toFixed(2)} {t('common.points')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {years.toFixed(1)} {t('common.years')}
                        </div>
                      </div>
                    </div>

                    {isContributive && (
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">{t('pension.stats.periodBreakdown.monthlyGrossSalary')}:</span>{' '}
                          {formatCurrency(period.monthlyGrossSalary || 0)}
                        </div>
                        <div>
                          <span className="font-medium">{t('pension.stats.periodBreakdown.workingCondition')}:</span>{' '}
                          {t(`pension.contributionPeriods.workingCondition.${period.workingCondition}`)}
                        </div>
                      </div>
                    )}

                    {!isContributive && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">{t('pension.stats.periodBreakdown.nonContributiveType')}:</span>{' '}
                        {t(`pension.contributionPeriods.nonContributivePeriod.${period.nonContributiveType}`)}
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
                        {pointPercentage.toFixed(1)}% {t('pension.stats.periodBreakdown.percentageOfTotal')}
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!inputs.contributionPeriods || inputs.contributionPeriods.length === 0) && (
                <div className="p-6 text-center text-gray-500">
                  {t('pension.stats.periodBreakdown.noPeriodsYet')}
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
                <h2 className="font-medium text-white">{t('pension.stats.pensionEstimate.title')}</h2>
              </div>
            </div>

            <div className="p-6">
              {pensionDetails.monthlyPension > 0 ? (
                <>
                  <div className="text-center">
                    <div className="text-sm text-blue-100 mb-2">{t('pension.stats.pensionEstimate.monthlyPension')}</div>
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1 whitespace-nowrap">
                      {formatCurrency(pensionDetails.monthlyPension)}
                    </div>
                    <div className="text-xs text-blue-200">
                      {t('pension.stats.pensionEstimate.basedOn', { points: pensionDetails.totalPoints.toFixed(2) })}
                    </div>
                  </div>
                  <div className="text-center mt-6 pt-4 border-t border-blue-400/30">
                    <div className="text-sm text-blue-100 mb-2">{t('pension.stats.pensionEstimate.yearlyPension')}</div>
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
                    {pensionDetails.error || t('pension.stats.pensionEstimate.completeMinimum')}
                  </p>
                </div>
              )}
              <div className="text-xs text-center text-blue-100/80 pt-4 border-t border-blue-400/30 mt-4">
                {t('pension.stats.pensionEstimate.formula')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionStats;