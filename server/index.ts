console.log("NYMARU CHI NYMARU ÑO NYMARU WOWOWOWOWO");
import { baseDeDatos, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
//import { monitorEventLoopDelay } from "perf_hooks";

const app = express();
const port = process.env.PORT || 3000;
const userCollection = baseDeDatos.collection("users");
const roomCollection = baseDeDatos.collection("rooms");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("listening on port " + port + "AXELOIDE");
});

app.post("/signup", (req, res) => {
  const { email, name, password } = req.body;
  console.log(
    email,
    name,
    password +
      "IO SOY FRANCHESCO VIRGULINIIII FIAAUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
  );

  userCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection
          .add({
            email,
            name,
            password,
          })
          .then((newUserRef) => {
            res.json({ id: newUserRef.id, new: true });
          });
      } else {
        res.json({
          message: "El email ya esta en uso, por favor ingrese otro",
        });
      }
    });
});
// AUTORIZACION

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  userCollection
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((serchResponse) => {
      if (serchResponse.empty) {
        res.status(404).json({ message: "Not found!" });
      } else {
        res.status(200).json({
          id: serchResponse.docs[0].id,
          name: serchResponse.docs[0].get("name"),
        });
      }
    });
});

app.post("/createGameRoom", (req, res) => {
  const { userId } = req.body;
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + uuidv4());
        roomRef
          .set({
            rooms: {
              currentGame: {
                [userId]: {
                  choice: "",
                  name: "",
                  online: false,
                  start: false,
                  score: 0,
                },
                secondPlayer: {
                  choice: "",
                  name: "",
                  online: false,
                  start: false,
                  score: 0,
                },
              },
            },
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res
                  .status(200)
                  .json({
                    shortId: roomId.toString(),
                    longRoomId: roomLongId.toString(),
                  });
              });
          });
      } else {
        res.status(400).json({ MESSAGE: "Quien sos capo?" });
      }
    });
});

app.post("/actualScore", (req, res) => {
  const { roomId, userId } = req.body;
  const roomRef = rtdb.ref(`/rooms/${roomId}`);

  roomRef.get().then((roomSnap) => {
    var roomSnapData = roomSnap.val();

    roomSnapData.rooms.currentGame[userId].score++;
    roomRef.update(roomSnapData);
  });
  res.json("PEACHES PEACHES PEACHES");
});

app.get(`/getRtdbRoomId/:roomId`, (req, res) => {
  const { roomId } = req.params;
  const roomRef = roomCollection.doc(roomId);

  roomRef.get().then((snap) => {
    if (snap.exists) {
      res.json(snap.data());
    } else {
      res.status(404).send({ message: "La sala no existe CUCHASTE" });
    }
  });
});

app.patch("/gameRoomsChanges/", (req, res) => {
  const { roomId, userId, userName, userStatus } = req.body;
  const roomRef = rtdb.ref(`/rooms/${roomId}`);

  roomRef.get().then((currentGameSnap) => {
    var currentGameSnapData = currentGameSnap.val();
    console.log(currentGameSnapData);
    // currentGameSnapData.userId.name = name;
    if (currentGameSnapData.rooms.currentGame.secondPlayer) {
      Object.assign(currentGameSnapData.rooms.currentGame, {
        [userId]: {
          choice: "",
          name: userName,
          online: userStatus,
          start: false,
          score: 0,
        },
      });
      delete currentGameSnapData.rooms.currentGame.secondPlayer;
    } else if (currentGameSnapData.rooms.currentGame[userId]) {
      currentGameSnapData.rooms.currentGame[userId].online = userStatus;
    }
    var currentGameUpdated = currentGameSnapData;
    roomRef.update(currentGameUpdated);
    res.json(currentGameUpdated);
  });
});
