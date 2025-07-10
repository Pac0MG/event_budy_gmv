import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { firebase, auth, database } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchUserData = async () => {
        if (user) {
          try {
            const doc = await database.collection('users').doc(user.uid).get();
            if (doc.exists && isActive) {
              setUserData(doc.data());
            }
          } catch (error) {
            console.error('Erro ao buscar dados do utilizador:', error);
          } finally {
            if (isActive) setLoading(false);
          }
        }
      };

      fetchUserData();

      return () => {
        isActive = false;
      };
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: '#fff', marginTop: 10 }}>A carregar perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://www.clipartmax.com/png/small/434-4349876_profile-icon-vector-png.png' }}
          style={styles.profileIcon}
        />
      </View>

      {userData?.name && (
        <>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </>
      )}

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user?.email}</Text>

      {userData?.favorites && (
        <>
          <Text style={styles.label}>Eventos favoritos:</Text>
          <Text style={styles.value}>{userData.favorites.length} evento(s)</Text>
        </>
      )}

      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});



