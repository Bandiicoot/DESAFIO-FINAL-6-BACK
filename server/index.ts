console.log("NYMARU CHI NYMARU ÑO NYMARU WOWOWOWOWO");
import { baseDeDatos, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
//import { monitorEventLoopDelay } from "perf_hooks";

const app = express();
const port = process.env.PORT || 3000;
console.log("este es el port", port);
const userCollection = baseDeDatos.collection("users");
const roomCollection = baseDeDatos.collection("rooms");

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://desafio-final-6.onrender.com/"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Add Access Control Allow Origin headers
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
  console.log(email, password);

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
  const { userId, userName } = req.body;
  //a ver si anda esto
  const roomRef = rtdb.ref("rooms/" + uuidv4());
  console.log("llega esto al back:", userId, "Este es el userName:", userName);
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomRef
          .set({
            rooms: {
              currentGame: {
                [userId]: {
                  choice: "",
                  name: userName,
                  online: true,
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
                res.json({
                  shortId: roomId.toString(),
                  longRoomId: roomLongId.toString(),
                });
              });
          });
      }
    });
});

app.post("/actualScore", (req, res) => {
  const { roomId, userId } = req.body;
  const roomRef = rtdb.ref(`rooms/${roomId}`);

  roomRef.get().then((roomSnap) => {
    var roomSnapData = roomSnap.val();

    roomSnapData.rooms.currentGame[userId].score++;
    roomRef.update(roomSnapData);
  });
  res.json("Victoria de peaches!");
});

app.post("/sendChoice", (req, res) => {
  const { roomId, userId, choice } = req.body;
  console.log("lo que se recibe:", roomId, userId, choice);
  const roomRef = rtdb.ref(`rooms/${roomId}`);

  roomRef.get().then((roomSnap) => {
    var roomSnapData = roomSnap.val();

    roomSnapData.rooms.currentGame[userId].choice = choice;
    roomSnapData.rooms.currentGame[userId].start = false;
    console.log("la roomSnapData:", roomSnapData);
    roomRef.update(roomSnapData);
  });
  res.json("Jugada hecha por PEACHES");
});

app.get(`/getRtdbRoomId/:roomId`, (req, res) => {
  const { roomId } = req.params;
  console.log("Este es el roomId:", roomId);

  const roomRef = roomCollection.doc(roomId);
  // No llega a obtener el roomRef

  roomRef.get().then((snap) => {
    if (snap.exists) {
      const snapData = snap.data();
      console.log("Axel no es un sith", snapData);
      res.json(snapData);
    } else {
      res.status(404).send({ message: "La sala no existe CUCHASTE" });
    }
  });
});

app.patch("/gameRoom/:longRoomId/:userId", (req, res) => {
  const { longRoomId, userId } = req.params;

  const userStatus: boolean = req.body.userStatus;

  const userName: string = req.body.userName;

  const roomRef = rtdb.ref(`rooms/` + longRoomId);
  roomRef.get().then((currentGameSnap) => {
    var currentGameSnapData = currentGameSnap.val();

    currentGameSnapData.currentGame[userId].online = userStatus;
    currentGameSnapData.currentGame[userId].name = userName;

    var currentGameUpdated = currentGameSnapData;
    console.log("Variable check: ", currentGameUpdated);

    roomRef.update(currentGameUpdated);
    res.json({ message: "Jugador online!" });
  });
});

app.patch("/gameRooms/:roomId/start/:userId", (req, res) => {
  const { roomId, userId } = req.params;
  console.log("roomiAIDI", roomId, "userAIDI:", userId);
  const roomRef = rtdb.ref(`rooms/${roomId}`);
  roomRef.get().then((currentGameSnap) => {
    var currentGameSnapData = currentGameSnap.val();
    console.log("Este es el snapaData sith:", currentGameSnapData);
    currentGameSnapData.rooms.currentGame[userId].online = true;
    currentGameSnapData.rooms.currentGame[userId].start = true;

    roomRef.update(currentGameSnapData);
  });
});

app.patch("/gameRoom/:roomId/restart/:userId", (req, res) => {
  const { roomId, userId } = req.params;
  const roomRef = rtdb.ref(`/rooms/${roomId}`);
  roomRef.get().then((currentGameSnap) => {
    var cgData = currentGameSnap.val();

    cgData.currentGame[userId].online = cgData = true;
    cgData.currentGame[userId].start = cgData = false;
    cgData.currentGame[userId].choice = cgData = "";
    roomRef.update(cgData);
  });
});

app.patch("/gameRoomsChanges/:roomId/:userId", (req, res) => {
  const { userName, userStatus } = req.body;
  const { roomId, userId } = req.params;
  const roomRef = rtdb.ref(`rooms/${roomId}`);
  console.log(
    "userId: " +
      userId +
      " userName: " +
      userName +
      "userStatus:" +
      userStatus +
      "roomRef: " +
      roomRef
  );

  roomRef.get().then((currentGameSnap) => {
    var currentGameSnapData = currentGameSnap.val();
    var message: string;
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
      message = "Te uniste a la sala";
    } else if (currentGameSnapData.rooms.currentGame[userId]) {
      currentGameSnapData.rooms.currentGame[userId].online = userStatus;
      currentGameSnapData.rooms.currentGame[userId].choice = "";
      currentGameSnapData.rooms.currentGame[userId].start = false;
      message = "Te conectaste a la sala";
    } else {
      message = "Sala llena";
    }
    if (message === "Te uniste a la sala" || "Te conectaste a la sala") {
      var currentGameUpdated = currentGameSnapData;
      roomRef.update(currentGameUpdated);
    }
    // res.json(currentGameUpdated);
    res.json({ message });
  });
});
