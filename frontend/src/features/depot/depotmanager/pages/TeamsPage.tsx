
import BackButton from '../../../../components/BackButton';
import { TeamList } from '../components/TeamList';

const TeamsPage = () => {
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Gestión de Equipos</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás gestionar los equipos de operarios encargados del armado de órdenes en el depósito.
          </p>
          <TeamList />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;