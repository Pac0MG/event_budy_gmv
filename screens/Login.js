// screens/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebaseConfig';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async () => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Erro ao iniciar sessão:', error);

    switch (error.code) {
      case 'auth/invalid-email':
        setError('Email inválido.');
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        setError('Credenciais inválidas.');
        break;
      case 'auth/user-disabled':
        setError('Esta conta foi desativada.');
        break;
      default:
        setError('Erro ao iniciar sessão. Tente novamente.');
    }
  }
};


  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://www.freeiconspng.com/uploads/calendar-icon-upcoming-events-31.png' }}
        style={styles.image}
      />
      <Text style={styles.subtitle}>Iniciar Sessão</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Não tem conta? Registe-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
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
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#1E90FF',
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});









