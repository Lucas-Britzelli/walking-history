import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../data/routes';

export default function RoutesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Curated Routes</Text>
      <FlatList
        data={ROUTES}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/route/${item.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.era}>{item.era}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="walk-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{item.distance}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{item.landmarks.length} landmarks</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#2C5F2E', padding: 20, paddingBottom: 12 },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { marginBottom: 8 },
  era: { fontSize: 12, fontWeight: '600', color: '#C8860A', textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 16 },
  meta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: '#666' },
});