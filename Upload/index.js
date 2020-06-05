import React, { useState, useEffect, Modal, TouchableOpacity, Clipboard} from 'react';

//expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';

import {
  Text, Button, Image, View
} from 'react-native';

import firebase from '../config/firebase';

import { WrapperView, CorrecaoView, Header, Content, Footer, Avatar } from './styles';
import { TextInput } from 'react-native-gesture-handler';

  
export default function Upload() {

  const [imagem, setImagem] = useState(null);
  const [txtURL, setTxtURL] = useState(null);

  uploadImagem = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = new Date().getTime();
    
    var ref = firebase.storage().ref().child('upload/' + filename);
    const ref2 = firebase.storage().ref().child('upload/' + 'resized-' +filename)

    ref.put(blob).then(function (snapshot) {
      
      snapshot.ref.getDownloadURL().then(function (downloadURL) {
        setImagem(downloadURL)
      
       setTxtURL(ref2.fullPath.toString())
      })

    })
    
   
    
  }

  escolherImagem = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        // setImagem(result.uri)
        uploadImagem(result.uri);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };



// <View style={{paddingLeft:5}}></View>
  return (
    <CorrecaoView>
      <WrapperView>
        <Header>
          <Text>Sou texto Um</Text>
        </Header>
    
        <Content>

          {imagem &&
            <Avatar source={{ uri: imagem }} style={{ width: 200, height: 200 }} />
          }

          <View style={{flexDirection: 'column'}}>
            <Button title="Escolher Imagem" onPress={() => { escolherImagem() }} />
           
          </View>

          {
            imagem &&
            <>
              
          <Text style={{textAlign:'center',borderColor: '#333', borderWidth: 1, borderRadius: 5, marginTop: 20,width: 300}}>{txtURL}</Text>
              
            </>
          }
          
       
   
        </Content>
        <Footer>
         
        </Footer>
      </WrapperView>
    </CorrecaoView>
  )}
  
        
