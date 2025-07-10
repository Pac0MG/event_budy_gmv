import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebase, auth, database } from '../firebaseConfig';
import eventosData from '../eventos.json';

const FavoriteIcon = ({ eventId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = database.collection('users').doc(user.uid);
          const userDoc = await userRef.get();
          const favorites = userDoc.data()?.favorites || [];
          setIsFavorite(favorites.includes(eventId));
        }
        setLoading(false);
      };

      fetchFavorites();
    }, [eventId])
  );

  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = database.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      let favorites = [];
      if (userDoc.exists) {
        favorites = userDoc.data().favorites || [];
      }

      let updatedFavorites;

      if (favorites.includes(eventId)) {
        updatedFavorites = favorites.filter((id) => id !== eventId);
        setIsFavorite(false);
      } else {
        updatedFavorites = [...favorites, eventId];
        setIsFavorite(true);
      }

      await userRef.set({ favorites: updatedFavorites }, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
    }
  };

  if (loading) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? '#FF2D55' : '#ccc'}
      />
    </TouchableOpacity>
  );
};

export default function Home() {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Olá! Como posso ajudar?' }]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setEventos(eventosData);
    setLoading(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setEventos(eventosData);
    }, [])
  );

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { from: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');

    let botResponse = 'Ainda estou a aprender. Tenta perguntar outra coisa!';

    if (userMessage.toLowerCase().includes('evento')) {
      botResponse = 'Podes ver os Eventos disponíveis na lista acima!';
    } else if (userMessage.toLowerCase().includes('favorito')) {
      botResponse = 'Para marcar um Evento como favorito, toca no ícone do coração nesta página ou clica no botão Adicionar aos favorito na página dos detalhes do Evento.';
    } else if (userMessage.toLowerCase().includes('olá')) {
      botResponse = 'Olá! Como posso ajudar?';
    } else if (userMessage.toLowerCase().includes('participar')) {
      botResponse = 'Para participar num Evento deves ir à página dos detalhes desse Evento e clicar no botão Participar.';
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: botResponse }]);
    }, 700);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { event: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          {new Date(item.datetime).toLocaleDateString('pt-PT', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        <View style={styles.iconRow}>
          <FavoriteIcon eventId={item.id} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {chatVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}
        >
          <View style={styles.chatBox}>
            <ScrollView
              style={styles.chatMessages}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {messages.map((msg, index) => (
                <Text
                  key={index}
                  style={{
                    alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.from === 'user' ? '#1E90FF' : '#333',
                    color: '#fff',
                    padding: 8,
                    borderRadius: 10,
                    marginBottom: 5,
                    maxWidth: '80%'
                  }}
                >
                  {msg.text}
                </Text>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Escreva aqui..."
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={handleSend}>
                <Ionicons name="send" size={24} color="#1E90FF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <TouchableOpacity
        style={styles.chatIconWrapper}
        onPress={() => setChatVisible(!chatVisible)}
      >
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/6014/6014401.png'
          }}
          style={styles.chatIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#aaa',
    marginVertical: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  chatIconWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 30,
    elevation: 5,
  },
  chatIcon: {
    width: 50,
    height: 50,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 280,
    maxHeight: 350,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
  },
  chatBox: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#444',
    paddingTop: 5,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 8,
  },
});







