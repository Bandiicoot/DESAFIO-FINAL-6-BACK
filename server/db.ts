import admin from "firebase-admin";
// import * as serviceAccount from "../key.json"; //Acordate que Axel es Boiviano

// console.log(admin);
// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(process.env.SERVICE_ACCOUNT as any),
  databaseURL: process.env.DB_URL,
});

const baseDeDatos = admin.firestore();
const rtdb = admin.database();
export { baseDeDatos, rtdb };
