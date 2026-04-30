import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ title: 'Walking History' }} />
      <Stack.Screen name="landmark/[id]" options={{ title: '' }} />
    </Stack>
  );
}