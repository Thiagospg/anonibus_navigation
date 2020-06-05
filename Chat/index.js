import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet, View, Text, Image, ScrollView,
  TextInput, TouchableOpacity, Clipboard, Platform,
  Modal, Alert
} from 'react-native';
import firebase from '../config/firebase';
import api from '../services/axios';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';




export default function Chat() {

  const [user, setUser] = useState(null)
  const [mensagens, setMensagens] = useState([])
  const [caixaTexto, setCaixaTexto] = useState('')
  const [scrollview, setScrollview] = useState('')
  const [alertVisibilityCopiar, setAlertVisibilityCopiar] = useState(false)

  const db = firebase.firestore()
  

  

  const salvar = () => {
    api.post('/enviarMensagem', {
      mensagem: caixaTexto,
      usuario: user.name,
      avatar: user.picture,
      data: getCurrentDate(),
    })
      .then(function () {
        // setMensagens([...mensagens, caixaTexto])
        setCaixaTexto('')
        scrollview.scrollToEnd({ animated: true })
      }).catch(function () {

      })
  }

  const getCurrentDate=()=>{

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hora = new Date().getHours();
    var minutos = new Date().getMinutes();
    var segundos = new Date().getSeconds();
    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return date + '-' + month + '-' + year + ':' + hora + ':' + minutos + ':' + segundos;
}

  useEffect(() => {
    
    carregaUsuario()
    
    let mensagens_enviadas = []
    const unsubscribe = db.collection("chats")
      .doc("sala_01").collection('mensagens')
      .onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const { mensagem, usuario, avatar, data } = change.doc.data()
            const id = change.doc.id
            mensagens_enviadas.push({ mensagem, usuario, avatar, data, id })
          }
        })
        setMensagens([...mensagens_enviadas])
        scrollview ? scrollview.scrollToEnd({ animated: true }) : null;
      })
    return () => {
      unsubscribe()
    }
  }, [])

  
  const carregaUsuario = () => {
    var usu = firebase.auth().currentUser;
    if (usu.providerData[0].providerId === 'google.com'){
      setUser({
        name: usu.providerData[0].displayName,
        picture: usu.providerData[0].photoURL
      })
      console.log('user', user)
      
    } else {
  
      axios.get('https://randomuser.me/api/')
        .then(function (response) {
          const user = response.data.results[0];
          // setDistance(response.data.distance)
          setUser({
            name: `${user.name.first} ${user.name.last}`,
            picture: user.picture.large
          })
          console.log('user', user)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const show_AlertCopiar = (visible) => {
 
    setAlertVisibilityCopiar(visible);
    
  }

  
  const copiar = (item) => { 
    Clipboard.setString(item.mensagem)
    setAlertVisibilityCopiar(true)
    
  }

  const downloadFile = (link) =>{
    const uri = link
    let time = getCurrentDate();
    let fileUri = FileSystem.documentDirectory + "img_anonibus-image_"+time+".jpg";
    FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
        saveFile(uri);
      })
      .catch(error => {
        console.error(error);
      })
}

const saveFile =async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Download", asset, false)
    }
}

function checkImageURL(item){
  fetch(item.mensagem)
     .then(res => {
     if(res.status == 404){
       alert('Endereço não encontrado !')
     }else{
      downloadFile(item.mensagem)
      Alert.alert("Aviso", "Download realizado com sucesso !");
    }
  })
 .catch(err => copiar(item))
 }

  return (
    <View style={styles.view}>
      <Modal
      visible={alertVisibilityCopiar}
      transparent={true}
      animationType={"fade"}
      onRequestClose={ () => { show_AlertCopiar(!alertVisibilityCopiar)} } 
      >

        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.Alert_Main_View}>
              <Text style={styles.Alert_Title}>Mensagem Copiada !</Text>
              <View style={{ width: '100%', height: 1, backgroundColor: '#fff'}} />
              <View style={{flexDirection: 'row', height: '20%'}}>
                <TouchableOpacity 
                style={styles.buttonStyle} 
                onPress={() => { show_AlertCopiar(!alertVisibilityCopiar)} } 
                activeOpacity={0.3} 
                >
                 <Text style={styles.TextStyle}> OK </Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>


      {user &&
        <>
          <TouchableOpacity onPress={carregaUsuario}>

            <Image
              style={styles.avatar}
              source={{ uri: user.picture }} />
          </TouchableOpacity>

          <Text style={styles.nome_usuario}>{user.name}</Text>
        </>

      }

      <ScrollView style={styles.scrollview} ref={(view) => { setScrollview(view) }}>
        {
          
          mensagens.length > 0 &&       
          mensagens.map(item => (
            
            <View key={item.id} style={styles.linha_conversa}>
              <Image style={styles.avatar_conversa} source={{ uri: item.avatar }} />
              <View style={{ flexDirection: 'column', marginTop: 5 }}>
                <TouchableOpacity onPress={() => checkImageURL(item)}> 
                
                  <Text style={{ fontSize: 12, color: '#999' }}>{item.usuario}</Text>
                 
                  {typeof (item.mensagem) == "string" ?
                    <Text>{item.mensagem}</Text>
                    :
                    <Text> </Text>
                  }
                </TouchableOpacity>
              </View>

            </View>
          ))
          
        }
      </ScrollView>


      <View style={styles.footer}>
        <TextInput
          style={styles.input_mensagem}
          onChangeText={text => setCaixaTexto(text)}
          value={caixaTexto} />

        <TouchableOpacity onPress={salvar}>
          <Ionicons style={{ margin: 3 }} name="md-send" size={32} color={'#999'} />
        </TouchableOpacity>
      </View>


      
    </View>)
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: '#000'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333'
  },

  avatar_conversa: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10
  },

  nome_usuario: {
    fontSize: 25,
    color: '#999'
  },

  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 50
  },
  input_mensagem: {
    borderColor: '#e6e6e6',
    borderWidth: 1,
    flex: 1,
    borderRadius: 4,
    margin: 10,
    marginTop: 0,
    padding: 4
  },
  scrollView: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
  },
  linha_conversa: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 60,
  },
  Alert_Main_View:{
 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : "#1E90FF", 
    height: 120 ,
    width: '75%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius:7,
   
  },
   
  Alert_Title:{
   
    fontSize: 25, 
    color: "#fff",
    textAlign: 'center',
    padding: 1,
    height: '40%'
   
  },
  
    buttonStyle: {
    
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },

    TextStyle:{
      color:'#000',
      textAlign:'center',
      fontSize: 22,
      marginTop: 5
  }
     
    
})
