
export interface DashboardStat {
  'goodCondition': number;
  'needMaintenance': number;
  'totalDevices': number;
}


export interface DeviceInfo {
  '_id': {
    '$oid': string
  };
  'deviceId': number;
  'name': string;
  'rul': number | null;
  'cycle_ran': number;
  'status': number;
}

export interface SensorReading {
  '_id': {
    '$oid': string
  };
  'id': number;
  'cond_1': number;
  'cond_2': number;
  'cond_3': number;
  'sn_1': number;
  'sn_2': number;
  'sn_3': number;
  'sn_4': number;
  'sn_5': number;
  'sn_6': number;
  'sn_7': number;
  'sn_8': number;
  'sn_9': number;
  'sn_10': number;
  'sn_11': number;
  'sn_12': number;
  'sn_13': number;
  'sn_14': number;
  'sn_15': number;
  'sn_16': number;
  'sn_17': number;
  'sn_18': number;
  'sn_19': number;
  'sn_20': number;
  'sn_21': number;
  'rul': number;
}


export interface PredictionGraphData {
  'rul': Array<number>;
  'smoothRul': Array<number>;
}


export interface SettingsResponse {
  '_id': {
    '$oid': string
  };
  'threshold': number;
  'last_updated': {
    '$date': number
  };
}

export interface Settings {
  'id': string;
  'threshold': number;
  'date': string;
}
