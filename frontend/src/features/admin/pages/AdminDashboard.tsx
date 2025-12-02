import { BarChart2, Users,   } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Gestión de Empleados",
    description: "Gestioná y administrá los empleados del sistema.",
    Icon: Users,
    link: "/admin/employees",
  },
  {
    title: "Reportes",
    description: "Consultá informes y métricas del sistema.",
    Icon: BarChart2,
    link: "/admin/reports",
  },  
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 sm:px-12 py-16">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
          Panel de Administración
        </h1>
        <p className="text-lg text-gray-700 mb-14">
          Todo lo que necesitás para gestionar los usuarios del sistema y obtener informes de la
          actividad del sistema.
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          {cards.map(({ title, description, Icon, link }, idx) => (
            <Link
              key={idx}
              to={link}
              className="flex items-center gap-6 rounded-3xl border border-gray-200 bg-white p-10 shadow-md hover:shadow-lg hover:border-gray-300 transition min-h-[230px]"
            >
              <div className="flex items-center justify-center rounded-2xl bg-red-50 w-16 h-16 flex-shrink-0">
                <Icon className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-base">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage; 
