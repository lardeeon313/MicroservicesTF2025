import {
  SatisfactionLabels,
  CustomerSatisfactionLevel,
} from "./CustomerSatisfactionType";

type Props = {
  level?: CustomerSatisfactionLevel;
};

export const CustomerSatisfactionLevelBadge: React.FC<Props> = ({ level }) => {
  if (!level) {
    return (
      <span className="px-2 py-1 text-sm font-medium rounded-xl bg-gray-200 text-gray-600">
        Sin calificación
      </span>
    );
  }

  const styles: Record<CustomerSatisfactionLevel, string> = {
    1: "bg-red-100 text-red-700",
    2: "bg-orange-100 text-orange-700",
    3: "bg-yellow-100 text-yellow-700",
    4: "bg-blue-100 text-blue-700",
    5: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 text-sm font-medium rounded-xl ${styles[level]}`}
    >
      {SatisfactionLabels[level]}
    </span>
  );
};
