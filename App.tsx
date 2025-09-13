import React, { useState, useCallback, useMemo } from 'react';
import type { Player, Attendance } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import PlayerManager from './components/PlayerManager';
import DateManager from './components/DateManager';
import AttendanceGrid from './components/AttendanceGrid';

const App: React.FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('players', []);
  const [dates, setDates] = useLocalStorage<string[]>('dates', []);
  const [attendance, setAttendance] = useLocalStorage<Attendance>('attendance', {});

  const addPlayer = useCallback((name: string) => {
    if (name.trim() === '' || players.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
      alert("El nombre del jugador no puede estar vacío o ya existir.");
      return;
    }
    const newPlayer: Player = { id: Date.now().toString(), name: name.trim() };
    setPlayers(prev => [...prev, newPlayer]);
    setAttendance(prev => ({
      ...prev,
      [newPlayer.id]: {},
    }));
  }, [players, setPlayers, setAttendance]);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    setAttendance(prev => {
      const newAttendance = { ...prev };
      delete newAttendance[id];
      return newAttendance;
    });
  }, [setPlayers, setAttendance]);

  const addDate = useCallback((date: string) => {
    if (date.trim() === '' || dates.includes(date)) {
      alert("Por favor, selecciona una fecha válida que no esté ya en la lista.");
      return;
    }
    setDates(prev => [...prev, date].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
  }, [dates, setDates]);

  const removeDate = useCallback((dateToRemove: string) => {
    setDates(prev => prev.filter(d => d !== dateToRemove));
    setAttendance(prev => {
      const newAttendance = { ...prev };
      for (const playerId in newAttendance) {
        if (newAttendance[playerId]?.[dateToRemove] !== undefined) {
          delete newAttendance[playerId][dateToRemove];
        }
      }
      return newAttendance;
    });
  }, [setDates, setAttendance]);

  const toggleAttendance = useCallback((playerId: string, date: string) => {
    setAttendance(prev => {
      const playerAttendance = prev[playerId] || {};
      const currentStatus = playerAttendance[date]; // Can be true, false, or undefined
      
      const newStatus = currentStatus === true ? false : true;

      return {
        ...prev,
        [playerId]: {
          ...playerAttendance,
          [date]: newStatus,
        },
      };
    });
  }, [setAttendance]);
  
  const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.name.localeCompare(b.name)), [players]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <PlayerManager players={sortedPlayers} onAddPlayer={addPlayer} onRemovePlayer={removePlayer} />
            <DateManager dates={dates} onAddDate={addDate} onRemoveDate={removeDate} />
          </div>
          <div className="lg:col-span-2">
            <AttendanceGrid players={sortedPlayers} dates={dates} attendance={attendance} onToggleAttendance={toggleAttendance} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;