import { useState } from 'react';
import { TeamList } from './TeamList';
import { ZoneList } from './ZoneList';
import { Users, MapPin } from 'lucide-react';

type TabType = 'teams' | 'zones';

export const TeamsManagement = () => {
    const [activeTab, setActiveTab] = useState<TabType>('teams');

    const tabs = [
        {
            id: 'teams' as TabType,
            name: 'Equipos',
            icon: Users,
            description: 'Gestiona los equipos de entrega'
        },
        {
            id: 'zones' as TabType,
            name: 'Zonas',
            icon: MapPin,
            description: 'Gestiona las zonas de entrega'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">Gestión de Equipos y Zonas</h1>
                <p className="text-gray-600 mt-1">
                    Administra los equipos de entrega y las zonas de cobertura
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon
                                    className={`mr-2 h-5 w-5 ${
                                        activeTab === tab.id
                                            ? 'text-red-500'
                                            : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'teams' && <TeamList />}
                {activeTab === 'zones' && <ZoneList />}
            </div>
        </div>
    );
};
