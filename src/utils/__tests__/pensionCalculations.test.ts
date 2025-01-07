import {
  calculateMonthlyPension,
  calculateContributionPoint,
  calculateStabilityPoints
} from '../pensionCalculations';
import { ContributionPeriod } from '../../types/pensionTypes';

describe('Pension Calculations', () => {
  describe('calculateContributionPoint', () => {
    it('should correctly calculate contribution points based on salary ratio', () => {
      expect(calculateContributionPoint(6789, 6789)).toBe(1);
      expect(calculateContributionPoint(13578, 6789)).toBe(2);
      expect(calculateContributionPoint(3394.5, 6789)).toBe(0.5);
    });
  });

  describe('calculateMonthlyPension', () => {
    const birthDate = '1990-01-01';
    
    it('should return 0 pension when no contribution periods', () => {
      const result = calculateMonthlyPension([], birthDate);
      expect(result.monthlyPension).toBe(0);
      expect(result.details.error).toContain('minimum contribution period');
    });

    it('should calculate pension correctly for valid contribution periods', () => {
      const periods: ContributionPeriod[] = [
        {
          fromDate: '2010-01-01',
          toDate: '2030-01-01',
          monthlyGrossSalary: 6789,
          workingCondition: 'normal'
        }
      ];

      const result = calculateMonthlyPension(periods, birthDate);
      expect(result.monthlyPension).toBeGreaterThan(0);
      expect(result.details.error).toBeUndefined();
    });

    it('should handle non-contributive periods correctly', () => {
      const periods: ContributionPeriod[] = [
        {
          fromDate: '2010-01-01',
          toDate: '2025-01-01',
          monthlyGrossSalary: 6789,
          workingCondition: 'normal'
        },
        {
          fromDate: '2008-01-01',
          toDate: '2010-01-01',
          nonContributiveType: 'university'
        }
      ];

      const result = calculateMonthlyPension(periods, birthDate);
      expect(result.details.nonContributivePoints).toBeGreaterThan(0);
    });

    it('should calculate stability points for long contribution periods', () => {
      const periods: ContributionPeriod[] = [
        {
          fromDate: '2015-01-01', // Person is 25 years old
          toDate: '2045-01-01',   // Person is 55 years old
          monthlyGrossSalary: 6789,
          workingCondition: 'normal'
        }
      ];

      const result = calculateMonthlyPension(periods, birthDate);
      expect(result.details.stabilityPoints).toBeGreaterThan(0);
    });
  });

  describe('calculateStabilityPoints', () => {
    const birthDate = '1990-01-01';

    it('should calculate stability points for different tiers', () => {
      const periods: ContributionPeriod[] = [
        {
          fromDate: '2015-01-01', // Person is 25 years old
          toDate: '2050-01-01',   // Person is 60 years old
          monthlyGrossSalary: 6789,
          workingCondition: 'normal'
        }
      ];

      const points = calculateStabilityPoints(periods, birthDate);
      expect(points).toBeGreaterThan(0);
    });

    it('should return 0 points for short contribution periods', () => {
      const periods: ContributionPeriod[] = [
        {
          fromDate: '2015-01-01',
          toDate: '2020-01-01',
          monthlyGrossSalary: 6789,
          workingCondition: 'normal'
        }
      ];

      const points = calculateStabilityPoints(periods, birthDate);
      expect(points).toBe(0);
    });
  });
});
