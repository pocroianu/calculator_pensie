import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ValidationStatus } from './types';

interface Props {
  status: ValidationStatus;
}

const StatusCard: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation();

  return (
    <div className={`p-4 rounded-xl border ${status.color}`}>
      <div className="flex items-start gap-3">
        {status.icon}
        <p className="text-sm">{status.message}</p>
      </div>
    </div>
  );
};

export default StatusCard;
