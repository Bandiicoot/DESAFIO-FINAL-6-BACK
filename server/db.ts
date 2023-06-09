import admin from "firebase-admin";
// import { initializeApp } from "firebase/app";
// import * as serviceAccount from "../key.json";
const account = JSON.parse(process.env.SERVICE_ACCOUNT);
const serviceAccount = account;
// console.log(admin);
//console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL:
    "https://m6-cap3-default-rtdb.firebaseio.com" || process.env.DB_URL,
});

const baseDeDatos = admin.firestore();
const rtdb = admin.database();
export { baseDeDatos, rtdb };
