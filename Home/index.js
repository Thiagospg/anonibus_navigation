import React, { useReducer, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { } from './styles';
import firebase from 'firebase';

export default Home = ({ navigation }) => {

const [usuario, setUsuario] = useState([])    


useEffect (() => {
  var user = firebase.auth().currentUser;
  setUsuario(user.providerData[0])
  
 /* if (user != null) {
    user.providerData.forEach(function (profile) {
      setUsuario(profile)
      console.log("Sign-in provider: " + profile.providerId);  
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });*/
  }

)
/*<Button title="Detalhes Sem Parametro" onPress={() =>
  navigation.push('HomeDetails')} />
<Button title="Detalhes Com Parametro" onPress={() =>
  navigation.push('HomeDetails', { name: 'Isso é um teste' })} />*/

  return (
    <View style={styles.container}>
      <>
        {
          usuario.photoURL !== null ? <Image style={styles.imagem} source={{ uri: usuario.photoURL}} /> : <Image style={styles.imagem} source={{ uri: 'https://stb.uninova.pt/ppl/gray_man.png'}} />
        }
      </>
      <Text style={styles.txtWelcome}>{`Seja bem vindo!`}</Text>
      {
        usuario.displayName !== null ? <Text style={styles.txtUser}>{usuario.displayName}</Text> : <Text style={styles.txtUser}>Anônimo</Text>
      }
      <Text style={{fontSize:50}}>;D</Text>
   
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: '#000'
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333'
  },
  txtWelcome: {
    fontWeight: 'bold',
    fontSize: 25,
    paddingTop:15,
  },
  txtUser: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop:10,
    color: 'tomato'
  }
});

