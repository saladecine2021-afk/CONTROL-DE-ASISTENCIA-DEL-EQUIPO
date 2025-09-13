import React from 'react';
import { SoccerBallIcon } from './icons/SoccerBallIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-gray-700 pb-4">
      <div className="flex items-center justify-center space-x-4">
        <SoccerBallIcon className="w-10 h-10 text-green-400" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Asistencia del Equipo
        </h1>
        <SoccerBallIcon className="w-10 h-10 text-green-400" />
      </div>
      <p className="mt-2 text-md text-gray-400">
        Gestiona la asistencia de tu equipo para entrenamientos y partidos.
      </p>
    </header>
  );
};

export default Header;