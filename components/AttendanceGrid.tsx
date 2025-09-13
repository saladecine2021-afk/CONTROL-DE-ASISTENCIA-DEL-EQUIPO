import React from 'react';
import type { Player, Attendance } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { ExportIcon } from './icons/ExportIcon';

interface AttendanceGridProps {
  players: Player[];
  dates: string[];
  attendance: Attendance;
  onToggleAttendance: (playerId: string, date: string) => void;
}

const AttendanceCell: React.FC<{
  status: boolean | undefined;
  onClick: () => void;
}> = ({ status, onClick }) => {
  const baseClasses = "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110";

  if (status === true) {
    return (
      <button onClick={onClick} className={`${baseClasses} bg-green-500/20 text-green-400`}>
        <CheckIcon className="w-6 h-6" />
      </button>
    );
  }
  if (status === false) {
    return (
      <button onClick={onClick} className={`${baseClasses} bg-red-500/20 text-red-400`}>
        <XIcon className="w-6 h-6" />
      </button>
    );
  }
  return (
    <button onClick={onClick} className={`${baseClasses} bg-gray-700/50 hover:bg-gray-600/50`}>
       <span className="text-gray-400 text-xs">N/A</span>
    </button>
  );
};

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ players, dates, attendance, onToggleAttendance }) => {
  const handleExportCSV = () => {
    if (players.length === 0 || dates.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
  
    // Usar punto y coma como delimitador para mejor compatibilidad con Excel en regiones de habla hispana.
    const DELIMITER = ';';
    const NEWLINE = '\r\n'; // Usar CRLF para mejor compatibilidad con Windows/Excel
  
    const statsHeaders = ['Presente', 'Ausente', 'N/A'];
    const header = ['Jugador', ...dates, ...statsHeaders].join(DELIMITER);
  
    const rows = players.map(player => {
      const playerAttendance = attendance[player.id] || {};
  
      const attendanceRow = dates.map(date => {
        const status = playerAttendance[date];
        if (status === true) return 'Presente';
        if (status === false) return 'Ausente';
        return 'N/A';
      });
  
      // Calcular estadísticas para la fila
      const presentCount = dates.filter(date => playerAttendance[date] === true).length;
      const absentCount = dates.filter(date => playerAttendance[date] === false).length;
      const notRecordedCount = dates.length - presentCount - absentCount;
      const statsData = [presentCount, absentCount, notRecordedCount];
  
      // Combinar nombre, datos de asistencia y estadísticas
      const fullRowData = [player.name, ...attendanceRow, ...statsData];
  
      return fullRowData.join(DELIMITER);
    });
  
    const csvContent = [header, ...rows].join(NEWLINE);
  
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `asistencia_equipo_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (players.length === 0 || dates.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Hoja de Asistencia</h2>
          <p className="text-gray-400">
            {players.length === 0 ? "Añade algunos jugadores para empezar." : "Añade algunas fechas para empezar a registrar la asistencia."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-400">Hoja de Asistencia</h2>
        <button
          onClick={handleExportCSV}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded-md flex items-center transition-colors duration-200 text-sm"
        >
          <ExportIcon className="w-5 h-5 mr-2" />
          Exportar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="sticky left-0 bg-gray-800 p-3 text-left font-semibold text-sm text-gray-300 z-20">Jugador</th>
              {dates.map((date) => (
                <th key={date} className="p-3 text-center font-semibold text-sm text-gray-300 min-w-[120px]">
                  {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}
                </th>
              ))}
              <th className="sticky right-[180px] bg-gray-800 p-3 text-center font-semibold text-sm text-gray-300 z-20 min-w-[90px] border-l-2 border-gray-700">Presente</th>
              <th className="sticky right-[90px] bg-gray-800 p-3 text-center font-semibold text-sm text-gray-300 z-20 min-w-[90px]">Ausente</th>
              <th className="sticky right-0 bg-gray-800 p-3 text-center font-semibold text-sm text-gray-300 z-20 min-w-[90px]">N/A</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
               const playerAttendance = attendance[player.id] || {};
               const presentCount = dates.filter(date => playerAttendance[date] === true).length;
               const absentCount = dates.filter(date => playerAttendance[date] === false).length;
               const notRecordedCount = dates.length - presentCount - absentCount;

              return (
              <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-700/50 group">
                <td className="sticky left-0 bg-gray-800 group-hover:bg-gray-700/50 p-3 font-medium whitespace-nowrap z-10">{player.name}</td>
                {dates.map((date) => (
                  <td key={date} className="p-2 align-middle">
                    <div className="flex justify-center">
                       <AttendanceCell 
                         status={attendance[player.id]?.[date]} 
                         onClick={() => onToggleAttendance(player.id, date)}
                       />
                    </div>
                  </td>
                ))}
                <td className="sticky right-[180px] p-2 align-middle text-center bg-gray-800 group-hover:bg-gray-700/50 z-10 border-l-2 border-gray-700">
                  <div className="flex items-center justify-center space-x-2" title={`${presentCount} presentes`}>
                    <CheckIcon className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-gray-200">{presentCount}</span>
                  </div>
                </td>
                <td className="sticky right-[90px] p-2 align-middle text-center bg-gray-800 group-hover:bg-gray-700/50 z-10">
                  <div className="flex items-center justify-center space-x-2" title={`${absentCount} ausentes`}>
                    <XIcon className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-gray-200">{absentCount}</span>
                  </div>
                </td>
                <td className="sticky right-0 p-2 align-middle text-center bg-gray-800 group-hover:bg-gray-700/50 z-10">
                   <div className="flex items-center justify-center space-x-2" title={`${notRecordedCount} sin registrar`}>
                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-200">{notRecordedCount}</span>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
          <tfoot className="bg-gray-800">
            <tr className="border-t-2 border-gray-700">
              <th className="sticky left-0 bg-gray-800 p-3 text-left font-semibold text-sm text-gray-300 z-20">Resumen</th>
              {dates.map((date) => {
                const present = players.filter(p => attendance[p.id]?.[date] === true).length;
                const absent = players.filter(p => attendance[p.id]?.[date] === false).length;
                const notRecorded = players.length - present - absent;
                
                return (
                  <td key={`${date}-summary`} className="p-2 align-middle">
                    <div className="flex items-center justify-center space-x-3 text-xs" aria-label={`Resumen para ${new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}`}>
                      <div className="flex items-center" title={`${present} presentes`}>
                        <CheckIcon className="w-4 h-4 text-green-400 mr-1" />
                        <span className="font-semibold text-gray-200">{present}</span>
                      </div>
                      <div className="flex items-center" title={`${absent} ausentes`}>
                        <XIcon className="w-4 h-4 text-red-400 mr-1" />
                        <span className="font-semibold text-gray-200">{absent}</span>
                      </div>
                      <div className="flex items-center" title={`${notRecorded} sin registrar`}>
                        <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-semibold text-gray-200">{notRecorded}</span>
                      </div>
                    </div>
                  </td>
                );
              })}
              <td className="sticky right-[180px] bg-gray-800 z-20 border-l-2 border-gray-700"></td>
              <td className="sticky right-[90px] bg-gray-800 z-20"></td>
              <td className="sticky right-0 bg-gray-800 z-20"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AttendanceGrid;