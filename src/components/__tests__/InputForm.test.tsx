import { render, screen, fireEvent } from '@testing-library/react';
import InputForm from '../InputForm';
import { PensionInputs, WorkingCondition } from '../../types/pensionTypes';

describe('InputForm', () => {
  const mockOnChange = jest.fn();

  const defaultInputs: PensionInputs = {
    birthDate: '1990-01-01',
    retirementYear: 2055,
    contributionPeriods: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(
      <InputForm
        inputs={defaultInputs}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Birth Date')).toBeInTheDocument();
    expect(screen.getByText('Planned Retirement Year')).toBeInTheDocument();
    expect(screen.getByText('Contribution Periods')).toBeInTheDocument();
  });

  it('allows adding a new contribution period', () => {
    render(
      <InputForm
        inputs={defaultInputs}
        onChange={mockOnChange}
      />
    );

    const addButton = screen.getByText('Add Period');
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith('contributionPeriods', [{
      fromDate: '',
      toDate: '',
      company: '',
      monthlyGrossSalary: 0,
      workingCondition: 'normal' as WorkingCondition
    }]);
  });

  it('allows updating birth date', () => {
    render(
      <InputForm
        inputs={defaultInputs}
        onChange={mockOnChange}
      />
    );

    const birthDateInput = screen.getByTitle('birthday');
    fireEvent.change(birthDateInput, { target: { value: '1995-01-01' } });

    expect(mockOnChange).toHaveBeenCalledWith('birthDate', '1995-01-01');
  });

  it('allows removing a contribution period', () => {
    const inputsWithPeriod = {
      ...defaultInputs,
      contributionPeriods: [{
        fromDate: '2010-01-01',
        toDate: '2015-01-01',
        company: 'Test Company',
        monthlyGrossSalary: 5000,
        workingCondition: 'normal' as WorkingCondition
      }]
    };

    render(
      <InputForm
        inputs={inputsWithPeriod}
        onChange={mockOnChange}
      />
    );

    const removeButton = screen.getByLabelText('Remove period');
    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith('contributionPeriods', []);
  });

  it('allows updating retirement year', () => {
    render(
      <InputForm
        inputs={defaultInputs}
        onChange={mockOnChange}
      />
    );

    const retirementYearInput = screen.getByRole('spinbutton');
    fireEvent.change(retirementYearInput, { target: { value: '2060' } });

    expect(mockOnChange).toHaveBeenCalledWith('retirementYear', 2060);
  });
});
