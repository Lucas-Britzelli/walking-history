import { Stack } from 'expo-router';
import { RouteProvider } from '../lib/RouteContext';

export default function RootLayout() {
  return (
    <RouteProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'Walking History' }} />
        <Stack.Screen name="landmark/[id]" options={{ title: '' }} />
        <Stack.Screen name="route/[id]" options={{ title: '' }} />
      </Stack>
    </RouteProvider>
  );
}