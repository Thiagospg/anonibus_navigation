const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');



// let serviceAccount = require("../keys/anonibus-23bbf-firebase-adminsdk-8t52x-c8fcb49974.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://anonibus-23bbf.firebaseio.com"
// });

admin.initializeApp();

let db = admin.firestore();

exports.enviarMensagem = functions.https
  .onRequest((request, response) => {
    let queryRef = db.collection('chats').doc('sala_01')
      .collection('mensagens').doc();

    queryRef.set({
      mensagem: request.body.mensagem,
      usuario: request.body.usuario,
      avatar: request.body.avatar,
      data: request.body.data,
    }).then(function () {
      response.json({
        "ok": true
      })
    })
      .catch(function () {
        response.json({
          "error": true
        })
      })
  })

exports.imageUpdateFirestore = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileName = path.basename(filePath);

  await db.collection('imagens').doc(fileName).set(object);

  console.log(fileName, object)

  return
})

const { Storage } = require('@google-cloud/storage');
const os = require('os');
const spawn = require('child-process-promise').spawn;
// // Create and Deploy Your Cloud Functions


const projectId = 'AIzaSyCsSoW9KRqvMlV7iHZ2NNyNiXsrwZPpxHA'
let gcs = new Storage ({
  projectId
});
exports.onFileChange = functions.storage.object().onFinalize(event => {
    // const object = event.bucket;
    const bucket = event.bucket;
    const contentType = event.contentType;
    const filePath = event.name;
    console.log('File change detected, function execution started');


    if (event.resourceState === 'not_exists') {
        console.log('We deleted a file, exit...');
        return;
    }


    if (path.basename(filePath).startsWith('resized-')) {
        console.log('We already renamed that file!');
        return;
    }


    const destBucket = gcs.bucket(bucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };

	console.log(destBucket)
	console.log(tmpFilePath)
	console.log(tmpFilePath)
	
    return destBucket.file(filePath).download({
        destination: tmpFilePath
    }).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '500x500', tmpFilePath]);
    }).then(() => {
        return destBucket.upload(tmpFilePath, {
            destination: 'upload/resized-' + path.basename(filePath),
            metadata: metadata
        })
    });
});