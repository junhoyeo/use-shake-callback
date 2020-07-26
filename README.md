# use-shake-callback
🐍 useShakeCallback hook for listening shaking events in React Native

## 📦 Installation

- Please note that this package uses `rxjs` and `react-native-sensors` as dependencies and have `react` and `react-native` as peer dependencies.

```bash
npm add use-shake-callback
# Or with yarn
yarn add use-shake-callback
```

## 🚀 Usage

```ts
import useShakeCallback from 'use-shake-callback';

useShakeCallback({
  updateInterval: 100,
  threshold: 5,
  onError: (error) => console.log(error),
}, () => {
  console.log('🐍 Shook Shook');
});
```
