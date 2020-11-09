import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
  SensorData,
} from 'react-native-sensors';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export interface ShakeConfig {
  updateInterval?: number;
  threshold?: number;
  onError?: (error: any) => void;
  onUnsubscribe?: () => void;
}

export type ShakeCallback = (speed: number) => void;

export default function useShakeCallback(
  callback: ShakeCallback,
  { updateInterval = 100, threshold = 5, onError, onUnsubscribe }: ShakeConfig = {},
): { appState: AppStateStatus } {
  const [lastAcceleration, setLastAcceleration] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [subscription, setSubscription] = useState<Subscription>();

  const getSpeed = ({ x, y, z, timestamp: currentTime }: SensorData) => {
    const gapTime = currentTime - lastUpdated;
    const currentSpeed = Math.abs(x + y + z - lastAcceleration) / gapTime;
    setLastAcceleration(x + y + z);
    setLastUpdated(currentTime);
    return currentSpeed * 10000;
  };

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, updateInterval);
    const sensor = accelerometer.pipe(
      // @ts-ignore
      map((sensorData) => getSpeed(sensorData)),
      filter((speed) => speed > threshold),
    );

    const onChangeAppState = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // @ts-ignore
        setSubscription(sensor.subscribe(callback, onError));
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        subscription?.unsubscribe();
        if (onUnsubscribe) {
          onUnsubscribe();
        }
      }
      setAppState(nextAppState);
    };

    // @ts-ignore
    setSubscription(sensor.subscribe(callback, onError));

    AppState.addEventListener('change', onChangeAppState);

    return () => AppState.removeEventListener('change', onChangeAppState);
  }, []);

  return { appState };
}
