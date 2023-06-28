import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";
// import generateRandomNumbers from "./game";

// // import { config } from "./config/config";
//
dotenv.config();
//
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const SERVER_PORT = process.env.SERVER_PORT;

app.use("/", express.static(path.resolve(__dirname, "../client")));

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    let result = JSON.parse(message);

    if (ws.readyState === WebSocket.OPEN) {
      if (result.type === "create") {
        let data = { data: generateRandomNumbers(4) };
        console.log("create new game");

        ws.send(JSON.stringify(data));
      } else if (result.type === "check") {
        console.log("do numbers check");
      } else if (result.type === "undo") {
        console.log("undo selected number...maybe not need to be done here?");
      } else if (result.type === "getCode") {
        let data = { data: generateRandomNumbers(4) };
        console.log("get new code...", data);

        ws.send(JSON.stringify(data));
      }
    }
  });

  // ws.send("I am a WebSocket server boyo");
});

server.listen(SERVER_PORT || 8999, () => {
  console.log(`Server started on port: ${SERVER_PORT} `);
});

function generateRandomNumbers(n: number): number[] {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(Math.floor(Math.random() * n) + 1);
  }
  return array;
}
