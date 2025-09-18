import { OrderStatus } from "../features/depot/depotmanager/types/OrderTypes";


interface TabItem {
  status: OrderStatus;
  label: string;
  count?: number;
}

interface Props {
  tabs: TabItem[];
  activeStatus: OrderStatus;
  onChange: (status: OrderStatus) => void;
}

export default function OrderTabs({ tabs, activeStatus, onChange }: Props) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => onChange(tab.status)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeStatus === tab.status
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && ` (${tab.count})`}
          </button>
        ))}
      </nav>
    </div>
  );
}
