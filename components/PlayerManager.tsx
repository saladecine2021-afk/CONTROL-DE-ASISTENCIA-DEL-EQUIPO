import React, { useState, useMemo } from 'react';
import type { Player } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PlayerManagerProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
}

const PlayerManager: React.FC<PlayerManagerProps> = ({ players, onAddPlayer, onRemovePlayer }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(newPlayerName);
    setNewPlayerName('');
  };

  const sortedPlayers = useMemo(() => 
    [...players].sort((a, b) => a.name.localeCompare(b.name)),
    [players]
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-green-400">Gestionar Jugadores</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Nombre del nuevo jugador"
          className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors duration-200">
          <PlusIcon className="w-5 h-5 mr-1" /> Añadir
        </button>
      </form>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {sortedPlayers.length === 0 ? (
          <p className="text-gray-400">Aún no se han añadido jugadores.</p>
        ) : (
          sortedPlayers.map((player) => (
            <div key={player.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
              <span className="font-medium">{player.name}</span>
              <button onClick={() => onRemovePlayer(player.id)} className="text-red-500 hover:text-red-400 transition-colors duration-200">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerManager;