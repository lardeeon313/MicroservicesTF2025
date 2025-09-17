import React, { ReactNode } from 'react';

interface InfoItemProps {
  icon: ReactNode;          // JSX o string (emoji)
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, bgColor, textColor }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
          <span className={`text-lg ${textColor}`}>{icon}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default InfoItem;
