import React, { useState } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { firebase, auth, database } from '../firebaseConfig';

export default function Favorites() {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchFavorites = async () => {
        try {
          setLoading(true);
          console.log('✅ Fetching favorites for user', userId);
          const userRef = database.collection('users').doc(userId);
          const userDoc = await userRef.get();
          const favorites = userDoc.data()?.favorites || [];

          if (favorites.length === 0) {
            if (isActive) setFavoriteEvents([]);
            return;
          }

          const eventsQuery = await database
            .collection('events')
            .where(firebase.firestore.FieldPath.documentId(), 'in', favorites)
            .get();

          const fetched = eventsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (isActive) {
            setFavoriteEvents(fetched);
          }
        } catch (err) {
          console.error('❌ Erro ao buscar favoritos:', err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      if (userId) fetchFavorites();

      return () => { isActive = false; };
    }, [userId])
  );

  const renderItem = ({ item }) => {
    const rawDate = item.datetime?.toDate?.() || new Date(item.datetime);
    const dateText = isNaN(rawDate.getTime())
      ? 'Data inválida'
      : rawDate.toLocaleDateString('pt-PT', {
          weekday: 'short', day: 'numeric',
          month: 'short', hour: '2-digit', minute: '2-digit'
        });

    return (
      <TouchableOpacity
        style={styles.eventContainer}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
        ) : (
          <View style={[styles.eventImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#ccc' }}>Sem imagem</Text>
          </View>
        )}
        <View style={styles.eventContent}>
          <Text style={styles.title}>{item.title || 'Sem título'}</Text>
          <Text style={styles.date}>{dateText}</Text>
          <Ionicons name="heart" size={22} color="#FF2D55" style={styles.heartIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoriteEvents.length === 0 ? (
        <Text style={styles.noFavoritesText}>Sem eventos favoritos ainda.</Text>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#121212', padding: 16
  },
  list: {
    paddingBottom: 20
  },
  eventContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e'
  },
  eventImage: {
    width: '100%', height: 180, backgroundColor: '#333'
  },
  eventContent: {
    padding: 12, position: 'relative'
  },
  title: {
    fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6
  },
  date: {
    fontSize: 14, color: '#ccc'
  },
  heartIcon: {
    position: 'absolute', top: 10, right: 10
  },
  loader: {
    flex: 1, justifyContent: 'center', backgroundColor: '#121212'
  },
  noFavoritesText: {
    color: '#ccc', fontSize: 16,
    textAlign: 'center', marginTop: 40
  },
});








