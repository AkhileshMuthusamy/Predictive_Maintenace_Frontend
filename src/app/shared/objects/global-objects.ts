
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
  'status': number;
}
