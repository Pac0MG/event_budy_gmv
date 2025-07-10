import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase, auth, database } from '../firebaseConfig';

export default function EventDetail({ route }) {
  const { event } = route.params;

  const [isParticipating, setIsParticipating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [participantCount, setParticipantCount] = useState(event.participants?.length || 0);

  const eventRef = database.collection('events').doc(event.id);
  const userRef = database.collection('users').doc(auth.currentUser?.uid);

  useEffect(() => {
    const fetchStatus = async () => {
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      const favorites = userData?.favorites || [];

      setIsFavorite(favorites.includes(event.id));

      const eventDoc = await eventRef.get();
      const eventData = eventDoc.data();
      const participants = eventData?.participants || [];

      setParticipantCount(participants.length);
      setIsParticipating(participants.includes(auth.currentUser?.uid));
    };

    fetchStatus();
  }, []);

  const toggleParticipation = async () => {
    const eventDoc = await eventRef.get();
    const data = eventDoc.data();
    let participants = data?.participants || [];

    if (participants.includes(auth.currentUser.uid)) {
      participants = participants.filter(uid => uid !== auth.currentUser.uid);
      setIsParticipating(false);
    } else {
      participants.push(auth.currentUser.uid);
      setIsParticipating(true);
    }

    await eventRef.update({ participants });
    setParticipantCount(participants.length);
  };

  const toggleFavorite = async () => {
    const userDoc = await userRef.get();
    const data = userDoc.data();
    let favorites = data?.favorites || [];

    if (favorites.includes(event.id)) {
      favorites = favorites.filter(id => id !== event.id);
      setIsFavorite(false);
    } else {
      favorites.push(event.id);
      setIsFavorite(true);
    }

    await userRef.update({ favorites });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} resizeMode="cover" />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>
            {new Date(event.datetime).toLocaleDateString('pt-PT', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <Text style={styles.infoText}>Total de participantes: {participantCount}</Text>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{event.description}</Text>

        <TouchableOpacity style={styles.button} onPress={toggleParticipation}>
          <Ionicons name={isParticipating ? 'close-circle' : 'checkmark-circle'} size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isParticipating ? 'Cancelar participação' : 'Participar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.favoriteButton]} onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#ccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ccc',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#FF2D55',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

