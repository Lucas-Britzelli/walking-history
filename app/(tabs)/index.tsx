import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

const LANDMARKS = [
      {
    id: '1',
    name: 'Gamla Stan',
    description: 'Stockholm\'s old town, dating back to the 13th century',
    coordinate: { latitude: 59.3233, longitude: 18.0686 },
  },
  {
    id: '2',
    name: 'Vasa Museum',
    description: 'Home to the 17th century warship Vasa',
    coordinate: { latitude: 59.3280, longitude: 18.0914 },
  },
  {
    id: '3',
    name: 'Stockholms Slott',
    description: 'The Royal Palace, one of the largest in Europe',
    coordinate: { latitude: 59.3268, longitude: 18.0717 },
  },
  {
    id: '4',
    name: 'Riddarhuset',
    description: 'The House of Nobility, built in the 17th century',
    coordinate: { latitude: 59.3248, longitude: 18.0651 },
  },
  {
    id: '5',
    name: 'Storkyrkan',
    description: 'Stockholm\'s cathedral, founded in the 13th century',
    coordinate: { latitude: 59.3258, longitude: 18.0706 },
  },
]

export default function MapScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
            onPress={() => { router.push(`/landmark/${landmark.id}`) }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});