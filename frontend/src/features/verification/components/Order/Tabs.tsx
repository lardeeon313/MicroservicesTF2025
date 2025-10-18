import React from 'react';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.key
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs; 