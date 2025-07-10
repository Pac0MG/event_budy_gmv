// screens/Signup.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as firebase from 'firebase';

WebBrowser.maybeCompleteAuthSession();

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'SEU_CLIENT_ID_EXPO.apps.googleusercontent.com',
    iosClientId: 'SEU_CLIENT_ID_IOS.apps.googleusercontent.com',
    androidClientId: 'SEU_CLIENT_ID_ANDROID.apps.googleusercontent.com',
    webClientId: 'SEU_CLIENT_ID_WEB.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.authentication;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token, access_token);

      firebase.auth().signInWithCredential(credential)
        .then(userCredential => {
          const user = userCredential.user;
          database.collection('users').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            favorites: [],
          }, { merge: true });
        })
        .catch(err => Alert.alert('Erro com Google Auth', err.message));
    }
  }, [response]);

  const handleSignup = () => {
    if (!email || !password || !name) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return database.collection('users').doc(user.uid).set({
          name,
          email,
          favorites: [],
        });
      })
      .catch(error => Alert.alert('Erro ao registar', error.message));
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://www.freeiconspng.com/uploads/calendar-icon-upcoming-events-31.png' }}
        style={styles.image}
      />
      <Text style={styles.subtitle}>Registo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Registar</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Já tem conta?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          Inicie a sessão
        </Text>
      </Text>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Registar com Google</Text>
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
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  googleButton: {
    marginTop: 40,
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});




