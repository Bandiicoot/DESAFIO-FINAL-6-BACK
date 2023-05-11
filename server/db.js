"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.baseDeDatos = void 0;
const firebase_admin_1 = require("firebase-admin");
const serviceAccount = require("../key.json"); //Acordate que Axel es Boiviano
// console.log(admin);
// console.log(serviceAccount);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: "https://m6-cap3-default-rtdb.firebaseio.com",
});
const baseDeDatos = firebase_admin_1.default.firestore();
exports.baseDeDatos = baseDeDatos;
const rtdb = firebase_admin_1.default.database();
exports.rtdb = rtdb;
