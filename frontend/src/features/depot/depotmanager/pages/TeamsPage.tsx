
import { TeamList } from '../components/TeamList';
import BackButton from '../components/BackButton';

const TeamsPage = () => {
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full py-20 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
              <p className="mt-2 text-gray-600">
                Administra los equipos de operarios del depósito
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>
        <TeamList />
      </div>
    </div>
  );
};

export default TeamsPage;