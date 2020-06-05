import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { } from './styles';

import { AuthContext } from '../context';

import firebase from 'firebase';



export default Profile = () => {

  const { signOut } = React.useContext(AuthContext)
  const [usuario, setUsuario] = useState([])    



  useEffect (() => {
    var user = firebase.auth().currentUser;
    setUsuario(user.providerData[0])
    })

  const handleSignOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      signOut();
    }).catch(function (error) {
      alert(error)
    });
  }

  return (
    <View style={styles.container}>
     <View style={{flex:1, padding:50}}>
        {
          usuario.photoURL !== null ? <Image style={styles.imagem} source={{ uri: usuario.photoURL}} /> : <Image style={styles.imagem} source={{ uri: 'https://stb.uninova.pt/ppl/gray_man.png'}} />
        }
      </View>
      <View style={{backgroundColor:'tomato',marginTop: 200,height:300, width:400,flex:1, padding:70}}>
        <Button title="Sair" onPress={() => handleSignOut()} />
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
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  }
});

