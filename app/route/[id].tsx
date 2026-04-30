import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../data/routes';

export default function RouteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const route = ROUTES.find(r => r.id === id);

  useEffect(() => {
    if (route) navigation.setOptions({ title: route.name });
  }, [route?.name]);

  if (!route) {
    return (
      <View style={styles.container}>
        <Text>Route not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.era}>{route.era}</Text>
        <Text style={styles.name}>{route.name}</Text>
        <Text style={styles.description}>{route.description}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{route.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="walk-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{route.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{route.landmarks.length} landmarks</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Ionicons name="navigate" size={20} color="#fff" />
        <Text style={styles.startText}>Start Route</Text>
      </TouchableOpacity>

      <View style={styles.landmarkList}>
        <Text style={styles.landmarksTitle}>Landmarks</Text>
        {route.landmarks.map((id, index) => (
          <View key={id} style={styles.landmarkItem}>
            <View style={styles.landmarkIndex}>
              <Text style={styles.landmarkIndexText}>{index + 1}</Text>
            </View>
            <Text style={styles.landmarkName}>Landmark {id}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingBottom: 0 },
  era: { fontSize: 12, fontWeight: '600', color: '#C8860A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 16 },
  meta: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: '#666' },
  startButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#2C5F2E', marginHorizontal: 20, marginBottom: 32,
    padding: 16, borderRadius: 12,
  },
  startText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  landmarkList: { paddingHorizontal: 20, paddingBottom: 40 },
  landmarksTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 },
  landmarkItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  landmarkIndex: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#2C5F2E', alignItems: 'center', justifyContent: 'center',
  },
  landmarkIndexText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  landmarkName: { fontSize: 16, color: '#1a1a1a' },
});