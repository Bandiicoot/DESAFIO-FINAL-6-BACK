import admin from "firebase-admin";
import * as serviceAccount from "../key.json"; //Acordate que Axel es Boiviano

// console.log(admin);
// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://m6-cap3-default-rtdb.firebaseio.com",
});

const baseDeDatos = admin.firestore();
const rtdb = admin.database();
export { baseDeDatos, rtdb };
