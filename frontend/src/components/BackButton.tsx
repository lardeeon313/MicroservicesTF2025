import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
  label?: string;
}

export default function BackButton({
  to,
  className = "",
  label = "Volver",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label={label}
      className={`group inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl shadow-sm  font-bold transition-all hover:cursor-pointer hover:bg-red-700 hover:shadow-xl transform hover:-translate-x-1
        ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-200" />
      <span className="transition-transform duration-200">{label}</span>
    </button>
  );
}
