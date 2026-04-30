import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

const LANDMARK_DATA: Record<string, { name: string; era: string; description: string; history: string }> = {
  '1': {
    name: 'Gamla Stan',
    era: 'Medieval',
    description: 'Stockholm\'s old town, dating back to the 13th century',
    history: 'Gamla Stan, meaning "The Old Town", is the oldest part of Stockholm. Founded in 1252, it sits on a small island and was the entirety of Stockholm for centuries. Its narrow cobblestone streets and colourful buildings have remained largely unchanged since the medieval period, making it one of the best preserved medieval city centres in Europe.',
  },
  '2': {
    name: 'Vasa Museum',
    era: '17th Century',
    description: 'Home to the 17th century warship Vasa',
    history: 'The Vasa warship was built between 1626 and 1628 on the orders of King Gustav II Adolf. Intended to be the pride of the Swedish navy, she sank on her maiden voyage in 1628 after sailing less than a mile. The ship remained on the seabed for 333 years until she was salvaged in 1961. Today she is the worlds best preserved 17th century ship and draws over a million visitors a year.',
  },
  '3': {
    name: 'Stockholms Slott',
    era: 'Medieval',
    description: 'The Royal Palace, one of the largest in Europe',
    history: 'Stockholm Palace is the official residence of the Swedish monarch. The current baroque palace was built in the 18th century on the site of a medieval fortress known as Tre Kronor, which burned down in 1697. With 1,430 rooms it is one of the largest palaces in Europe still in use. The palace hosts several museums and is open to the public during summer months.',
  },
  '4': {
    name: 'Riddarhuset',
    era: '17th Century',
    description: 'The House of Nobility, built in the 17th century',
    history: 'Riddarhuset, or the House of Nobility, was built between 1641 and 1674 and served as the meeting place for the Swedish nobility during the Age of Greatness. It is considered one of the finest examples of Dutch Baroque architecture in Sweden. The building still serves as the headquarters of the Swedish House of Nobility and its great hall contains the coats of arms of over 2,300 noble families.',
  },
  '5': {
    name: 'Storkyrkan',
    era: 'Medieval',
    description: 'Stockholm\'s cathedral, founded in the 13th century',
    history: 'Storkyrkan, meaning "The Great Church", is the oldest church in Gamla Stan and serves as the cathedral of the Diocese of Stockholm. The church was founded in the late 13th century and has been the site of royal coronations, weddings and funerals for centuries. It houses the famous sculpture of Saint George and the Dragon from 1489, as well as a painting depicting the Stockholm Blood Bath of 1520.',
  },
};

export default function LandmarkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const landmark = LANDMARK_DATA[id];
  const [speaking, setSpeaking] = useState(false);

  if (!landmark) {
    return (
      <View style={styles.container}>
        <Text>Landmark not found</Text>
      </View>
    );
  }

  const handleSpeak = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      Speech.speak(landmark.history, {
        language: 'en-GB',
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    }
  };
  const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ title: landmark.name });
    }, [landmark.name]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2C5F2E" />
        <Text style={styles.backText}>Map</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.era}>{landmark.era}</Text>
        <Text style={styles.name}>{landmark.name}</Text>
        <Text style={styles.description}>{landmark.description}</Text>
      </View>

      <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
        <Ionicons name={speaking ? 'stop-circle' : 'volume-high'} size={24} color="#fff" />
        <Text style={styles.speakText}>{speaking ? 'Stop' : 'Listen'}</Text>
      </TouchableOpacity>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        <Text style={styles.history}>{landmark.history}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  backText: { color: '#2C5F2E', fontSize: 16 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  era: { fontSize: 13, fontWeight: '600', color: '#C8860A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  name: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  speakButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#2C5F2E', marginHorizontal: 20, marginBottom: 24,
    padding: 14, borderRadius: 12, justifyContent: 'center',
  },
  speakText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  historyContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  history: { fontSize: 16, color: '#444', lineHeight: 28 },
});