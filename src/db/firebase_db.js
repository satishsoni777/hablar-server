import admin from 'firebase-admin';

import serviceAccount from './config/serviceAccountKey.json';

const collectionName = 'rooms';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://makeiteasy-fc51f.firebaseio.com"
});

const deleteRooms = (params) => {
    const { roomId } = params;
    const documentRef = db.collection(collectionName).doc(roomId);
    documentRef
        .delete()
        .then(() => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

