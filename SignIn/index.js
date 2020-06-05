import React from "react";
import { View, Text, TextInput, StyleSheet, Button, Image } from "react-native";
import { AuthContext } from '../context';
import { } from './styles';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import axios from 'axios';


export default SignIn = ({ navigation }) => {

  const { signIn } = React.useContext(AuthContext)

  const [textEmail, setTextEmail] = React.useState('')
  const [textPassword, setTextPassword] = React.useState('')

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(textEmail, textPassword)
      .then(() => signIn())
      .catch(error => alert(error))

  }

  const signInWithGoogleAsync = async () => {
    let androidId = '577154091428-rsl40lje6jqtids3vk7p8evqhnu9aoiu.apps.googleusercontent.com'
    let iosId = '577154091428-ddgc19euietdcfkobhfcfrdip1hgptks.apps.googleusercontent.com'
    try {
      const result = await Google.logInAsync({
        behaviour:'web',
        androidClientId: androidId,
        iosClientId: iosId,
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)   
        
        firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          let user = carregaInformacoesGoogle(result.accessToken)
          signIn()
        })
      .catch(error => alert(error))
      
      

      } else {
      
        return { cancelled: true };
      }
    } catch (e) {
      alert(e)
      return { error: true };
    }
  }

  const carregaInformacoesGoogle = (token) => {
    console.log(token);
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+ token)
      .then(function (response) {
       return response.data
        
     
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  return (
    <View style={styles.container}>
      <View style={styles.view_fields}>
        <TextInput
          style={styles.input_auth}
          onChangeText={text => setTextEmail(text.toLowerCase())}
          value={textEmail} />

        <TextInput
          style={styles.input_auth}
          onChangeText={text => setTextPassword(text)}
          value={textPassword} secureTextEntry={true} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{margin: 5}}>
          <Button title="Acessar" onPress={() => handleSignIn()} />
        </View>
        <View style={{margin: 5}}>
          <Button title="Acessar com Google" onPress={() => signInWithGoogleAsync()} />
        </View>
      </View>
      <View style={{margin: 5, width: 400, marginTop:20}}>
        <Button title="Criar Conta" onPress={() => navigation.push("CreateAccount")} />
        </View>
        
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  input_auth: {
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    borderRadius: 3,
    margin: 10,
    marginTop: 0,
    padding: 4
  },
  view_fields: {
    flexDirection: 'column',
    width: '100%',
    height: 100
  }
});

