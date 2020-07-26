# use-shake-callback
🐍 useShakeCallback hook for listening shaking events in React Native

```ts
import useShakeCallback from 'use-shake-callback';

useShakeCallback({
  updateInterval: 100,
  threshold: 800,
}, () => {
  console.log('🐍 Shook Shook');
});
```
