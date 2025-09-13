import React from 'react';
import type { Player, Attendance } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';

interface PlayerStatsProps {
  players: Player[];
  dates: string[];
  attendance: Attendance;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ players, dates, attendance }) => {
  if (players.length === 0 || dates.length === 0) {
    return null; // No mostrar nada si no hay datos para resumir
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-green-400">Resumen por Jugador</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="p-3 text-left font-semibold text-sm text-gray-300">Jugador</th>
              <th className="p-3 text-center font-semibold text-sm text-gray-300 min-w-[90px]">Presente</th>
              <th className="p-3 text-center font-semibold text-sm text-gray-300 min-w-[90px]">Ausente</th>
              <th className="p-3 text-center font-semibold text-sm text-gray-300 min-w-[90px]">N/A</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const playerAttendance = attendance[player.id] || {};
              const presentCount = dates.filter(date => playerAttendance[date] === true).length;
              const absentCount = dates.filter(date => playerAttendance[date] === false).length;
              const notRecordedCount = dates.length - presentCount - absentCount;

              return (
                <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-medium whitespace-nowrap">{player.name}</td>
                  <td className="p-2 align-middle text-center">
                    <div className="flex items-center justify-center space-x-2" title={`${presentCount} presentes`}>
                      <CheckIcon className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-gray-200">{presentCount}</span>
                    </div>
                  </td>
                  <td className="p-2 align-middle text-center">
                    <div className="flex items-center justify-center space-x-2" title={`${absentCount} ausentes`}>
                      <XIcon className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-gray-200">{absentCount}</span>
                    </div>
                  </td>
                  <td className="p-2 align-middle text-center">
                    <div className="flex items-center justify-center space-x-2" title={`${notRecordedCount} sin registrar`}>
                      <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-200">{notRecordedCount}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStats;