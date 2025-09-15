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
      className={`group inline-flex items-center gap-2 px-5 py-2.5 
        text-sm font-medium text-gray-700 bg-white border border-gray-300 
        rounded-xl shadow-sm 
        hover:bg-red-500 hover:text-white 
        hover:shadow-md 
        focus:outline-none focus:ring-1 focus:ring-red-500 
        transition-all duration-200 
        hover:translate-x-1 active:scale-95
        ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-200" />
      <span className="transition-transform duration-200">{label}</span>
    </button>
  );
}
