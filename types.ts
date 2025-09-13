
export interface Player {
  id: string;
  name: string;
}

export interface Attendance {
  [playerId: string]: {
    [date: string]: boolean; // true = present, false = absent
  };
}
