import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ProfileScreen() {
  const [avoidFerries, setAvoidFerries] = useState(true);
  const [avoidSteps, setAvoidSteps] = useState(false);

  return (
    <ScrollView style={styles.container}>

      {/* Avatar & Sign In */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>Traveller</Text>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign in to save your progress</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="footsteps" size={24} color="#2C5F2E" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Routes{'\n'}Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location" size={24} color="#2C5F2E" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Landmarks{'\n'}Visited</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="walk" size={24} color="#2C5F2E" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Kilometres{'\n'}Walked</Text>
          </View>
        </View>
      </View>

      {/* Accessibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Avoid Ferries</Text>
            <Text style={styles.settingDescription}>Route along walkable streets only</Text>
          </View>
          <Switch
            value={avoidFerries}
            onValueChange={setAvoidFerries}
            trackColor={{ false: '#ccc', true: '#2C5F2E' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Avoid Steps</Text>
            <Text style={styles.settingDescription}>Prefer ramps and flat paths</Text>
          </View>
          <Switch
            value={avoidSteps}
            onValueChange={setAvoidSteps}
            trackColor={{ false: '#ccc', true: '#2C5F2E' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Ionicons name="map" size={20} color="#2C5F2E" />
          <Text style={styles.infoText}>Walking History v1.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="location" size={20} color="#2C5F2E" />
          <Text style={styles.infoText}>Currently exploring Stockholm</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', backgroundColor: '#fff', paddingVertical: 32, marginBottom: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#2C5F2E', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  signInButton: {
    backgroundColor: '#EAF2EA', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  signInText: { color: '#2C5F2E', fontWeight: '600', fontSize: 14 },
  section: { backgroundColor: '#fff', marginBottom: 16, paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#999', textAlign: 'center', lineHeight: 16 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  settingInfo: { flex: 1, marginRight: 16 },
  settingLabel: { fontSize: 16, color: '#1a1a1a', marginBottom: 2 },
  settingDescription: { fontSize: 13, color: '#999' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoText: { fontSize: 15, color: '#444' },
});