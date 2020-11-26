import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';

const DEFAULT = {
  username: '',
  password: '',
  isLogged: false,
  resp: '-',
  message: 'Realize o login',
}

const API = 'https://qrcode-backend-les.herokuapp.com/auth';

export default function App() {
  const [state, setState] = useState(DEFAULT)

  function onLogin() {
    return fetch(API, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: state.username,
        password: state.password
      }),
    })
      .then(async (respostaServidor) => {
        if (respostaServidor.ok) {
          const resposta = await respostaServidor.json();
          if (resposta.success) {
            setState({
              ...state, 
              isLogged: true,
            });
          } else {
            setState({
              ...state, 
              isLogged: false,
            });
          }
          setState({
            ...state,
            resp: resposta.resp,
            message: resposta.resp
          });
        } 
  
        throw new Error('Não foi possível realizar o acesso');
      });
  }

  return (
    <View style={styles.container}>
      {state.isLogged 
      ? <View style={styles.card}>
          <QRCode size={200} value={state.resp} />
        </View>
      
      : <View style={styles.card}>
          <Text>
            {state.message}
          </Text>

          <TextInput
            style={styles.form}
            placeholder="login"
            value={state.username}
            onChangeText={value => setState({...state, username: value})}
          />
          <TextInput
            style={styles.form}
            placeholder="password"
            value={state.password}
            onChangeText={value => setState({...state, password: value})}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={() => onLogin()}>
            <View style={styles.button}>
              <Text style={styles.btnText}>enter</Text>
            </View>
          </TouchableOpacity>
        </View>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '70%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  form: {
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 170,
    height: 50,
    fontSize: 24,
    
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#808080",
  
    margin: 5,
  },
  button: {
    backgroundColor: "#8BCE00",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 170,
    height: 50,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#808080",

    margin: 5,
  },
  btnText: {
    width: "auto",
    height: 50,
    color: "white",
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
