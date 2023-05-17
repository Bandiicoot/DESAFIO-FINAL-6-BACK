"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.baseDeDatos = void 0;
const firebase_admin_1 = require("firebase-admin");
// import { initializeApp } from "firebase/app";
// import * as serviceAccount from "../key.json"; //Acordate que Axel es Boiviano
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
// console.log(admin);
// console.log(serviceAccount);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL,
});
const baseDeDatos = firebase_admin_1.default.firestore();
exports.baseDeDatos = baseDeDatos;
const rtdb = firebase_admin_1.default.database();
exports.rtdb = rtdb;
