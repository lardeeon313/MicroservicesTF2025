import { TeamsManagement } from '../components/Teams/TeamsManagement';
import BackButton from '../components/BackButton';

const TeamsPageVerification = () => {
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TeamsManagement />
        </div>
      </div>
    </div>
  );
};

export default TeamsPageVerification;