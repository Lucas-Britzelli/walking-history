import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ROUTES } from '../../data/routes';

const LANDMARK_COORDS: Record<string, { latitude: number; longitude: number; name: string }> = {
  '1': { latitude: 59.3233, longitude: 18.0686, name: 'Gamla Stan' },
  '2': { latitude: 59.3280, longitude: 18.0914, name: 'Vasa Museum' },
  '3': { latitude: 59.3268, longitude: 18.0717, name: 'Stockholms Slott' },
  '4': { latitude: 59.3248, longitude: 18.0651, name: 'Riddarhuset' },
  '5': { latitude: 59.3258, longitude: 18.0706, name: 'Storkyrkan' },
};

const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY || '';

function getBounds(coords: { latitude: number; longitude: number }[]) {
  const lats = coords.map(c => c.latitude);
  const lngs = coords.map(c => c.longitude);
  const midLat = (Math.max(...lats) + Math.min(...lats)) / 2;
  const midLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
  const deltaLat = (Math.max(...lats) - Math.min(...lats)) * 1.4;
  const deltaLng = (Math.max(...lngs) - Math.min(...lngs)) * 1.4;
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: Math.max(deltaLat, 0.01),
    longitudeDelta: Math.max(deltaLng, 0.01),
  };
}

export default function RouteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const route = ROUTES.find(r => r.id === id);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route) navigation.setOptions({ title: route.name });
  }, [route?.name]);

  useEffect(() => {
    if (!route) return;

    const fetchRoute = async () => {
      const coords = route.landmarks.map(lid => {
        const lm = LANDMARK_COORDS[lid];
        return [lm.longitude, lm.latitude];
      });

      try {
        const response = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
          method: 'POST',
          headers: {
            'Authorization': ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: coords,
            options: {
              avoid_features: ['ferries', 'steps', 'fords'],
            }
           }),
        });

        const data = await response.json();
        const points = data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
        );
        setRouteCoords(points);
      } catch (err) {
        console.error('Failed to fetch route:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [route]);

  if (!route) {
    return (
      <View style={styles.container}>
        <Text>Route not found</Text>
      </View>
    );
  }

  const landmarkCoords = route.landmarks.map(lid => LANDMARK_COORDS[lid]);
  const mapRegion = getBounds(landmarkCoords);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={mapRegion}>
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#2C5F2E"
              strokeWidth={4}
            />
          )}
          {route.landmarks.map((lid, index) => (
            <Marker
              key={lid}
              coordinate={LANDMARK_COORDS[lid]}
              title={LANDMARK_COORDS[lid].name}
              pinColor="#2C5F2E"
            />
          ))}
        </MapView>
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading route...</Text>
          </View>
        )}
      </View>

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
        {route.landmarks.map((lid, index) => (
          <View key={lid} style={styles.landmarkItem}>
            <View style={styles.landmarkIndex}>
              <Text style={styles.landmarkIndexText}>{index + 1}</Text>
            </View>
            <Text style={styles.landmarkName}>{LANDMARK_COORDS[lid].name}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: 'auto' }} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { width: '100%', height: 280, position: 'relative' },
  map: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center',
  },
  loadingText: { color: '#2C5F2E', fontWeight: '600' },
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