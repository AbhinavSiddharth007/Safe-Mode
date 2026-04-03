export type Warning = {
  id: string;
  latitude: number;
  longitude: number;
  message: string;
  timestamp: number;
};

export type WarningLocationGroup = {
  key: string;
  latitude: number;
  longitude: number;
  totalWarnings: number;
  warnings: Warning[];
};
