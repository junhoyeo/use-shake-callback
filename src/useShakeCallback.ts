import { useEffect, useState } from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
  SensorData,
} from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';

export interface ShakeConfig {
  updateInterval?: number;
  threshold?: number;
  onError?: (error: any) => void;
}

export type ShakeCallback = (speed: number) => void;

export default function useShakeCallback(
  callback: ShakeCallback,
  { updateInterval = 100, threshold = 5, onError }: ShakeConfig = {},
): void {
  const [lastAcceleration, setLastAcceleration] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const getSpeed = ({ x, y, z, timestamp: currentTime }: SensorData) => {
    const gapTime = (currentTime as unknown as number) - lastUpdated;
    const currentSpeed = Math.abs(x + y + z - lastAcceleration) / gapTime;
    setLastAcceleration(x + y + z);
    setLastUpdated(currentTime as unknown as number);
    return currentSpeed * 10000;
  };

  return useEffect(
    () => {
      setUpdateIntervalForType(SensorTypes.accelerometer, updateInterval);
      const subscription = accelerometer
        .pipe(
          map((sensorData) => getSpeed(sensorData)),
          filter((speed) => speed > threshold))
        .subscribe(callback, onError);

      return () => subscription.unsubscribe();
    },
    [],
  );
}
