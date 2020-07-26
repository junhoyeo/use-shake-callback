import { useEffect } from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';

interface ShakeConfig {
  updateInterval?: number;
  threshold?: number;
  onError?: (error: any) => void;
}

export default function useShakeCallback({
  updateInterval = 100,
  threshold = 800,
  onError,
}: ShakeConfig, callback: (speed: number) => void): void {
  return useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, updateInterval);
    const subscription = accelerometer
      .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > threshold))
      .subscribe(callback, onError);

    return subscription.unsubscribe;
  });
}
