import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useRoute } from '../../lib/RouteContext';




const LANDMARKS = [
  {
    id: '1',
    name: 'Gamla Stan',
    era: 'Medieval',
    description: 'Stockholm\'s old town, dating back to the 13th century',
    coordinate: { latitude: 59.3233, longitude: 18.0686 },
  },
  {
    id: '2',
    name: 'Vasa Museum',
    era: '17th Century',
    description: 'Home to the 17th century warship Vasa',
    coordinate: { latitude: 59.3280, longitude: 18.0914 },
  },
  {
    id: '3',
    name: 'Stockholms Slott',
    era: 'Medieval',
    description: 'The Royal Palace, one of the largest in Europe',
    coordinate: { latitude: 59.3268, longitude: 18.0717 },
  },
  {
    id: '4',
    name: 'Riddarhuset',
    era: '17th Century',
    description: 'The House of Nobility, built in the 17th century',
    coordinate: { latitude: 59.3248, longitude: 18.0651 },
  },
  {
    id: '5',
    name: 'Storkyrkan',
    era: 'Medieval',
    description: 'Stockholm\'s cathedral, founded in the 13th century',
    coordinate: { latitude: 59.3258, longitude: 18.0706 },
  },
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

export default function MapScreen() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const { activeRoute, setActiveRoute } = useRoute();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [nearestLandmark, setNearestLandmark] = useState<typeof LANDMARKS[0] & { distance: number } | null>(null);


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });

      const withDistance = LANDMARKS.map(lm => ({
        ...lm,
        distance: getDistance(latitude, longitude, lm.coordinate.latitude, lm.coordinate.longitude),
      }));

      const nearest = withDistance.sort((a, b) => a.distance - b.distance)[0];
      setNearestLandmark(nearest);
    })();
  }, []);
  useEffect(() => {
  if (activeRoute && activeRoute.coords.length > 0 && mapRef.current) {
    mapRef.current.fitToCoordinates(activeRoute.coords, {
      edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
      animated: true,
    });
  }
}, [activeRoute]);
   return (
    <View style={styles.container}>
<MapView
  style={styles.map}
  showsUserLocation={true}
  initialRegion={{
    latitude: 59.3255,
    longitude: 18.0700,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }}
>
  {LANDMARKS.map(landmark => (
    <Marker
      key={landmark.id}
      coordinate={landmark.coordinate}
      title={landmark.name}
      description={landmark.description}
      pinColor='#2C5F2E'
      onPress={() => router.push(`/landmark/${landmark.id}`)}
    />
  ))}

  {activeRoute && activeRoute.coords.length > 0 && (
    <Polyline
      coordinates={activeRoute.coords}
      strokeColor="#2C5F2E"
      strokeWidth={4}
    />
  )}
</MapView>

{activeRoute ? (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <Text style={styles.cardEra}>Active Route</Text>
      <Text style={styles.cardName}>{activeRoute.name}</Text>
      <View style={styles.cardDistance}>
        <Ionicons name="navigate" size={14} color="#2C5F2E" />
        <Text style={styles.cardDistanceText}>{activeRoute.landmarks.length} landmarks</Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.stopButton}
      onPress={() => setActiveRoute(null)}
    >
      <Text style={styles.stopButtonText}>Stop</Text>
    </TouchableOpacity>
  </View>
) : nearestLandmark ? (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <Text style={styles.cardEra}>{nearestLandmark.era}</Text>
      <Text style={styles.cardName}>{nearestLandmark.name}</Text>
      <View style={styles.cardDistance}>
        <Ionicons name="location" size={14} color="#2C5F2E" />
        <Text style={styles.cardDistanceText}>{formatDistance(nearestLandmark.distance)}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.cardButton}
      onPress={() => router.push(`/landmark/${nearestLandmark.id}`)}
    >
      <Text style={styles.cardButtonText}>Learn More</Text>
      <Ionicons name="chevron-forward" size={16} color="#2C5F2E" />
    </TouchableOpacity>
  </View>
) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: { flex: 1 },
  cardEra: { fontSize: 11, fontWeight: '600', color: '#C8860A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  cardDistance: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDistanceText: { fontSize: 13, color: '#2C5F2E', fontWeight: '500' },
  cardButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 12 },
  cardButtonText: { fontSize: 14, fontWeight: '600', color: '#2C5F2E' },
  stopButton: {
  backgroundColor: '#e74c3c',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
},
stopButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});