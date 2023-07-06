import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";
// import generateRandomNumbers from "./game";
import { ServerGame } from "./game";

// // import { config } from "./config/config";
//
dotenv.config();
//
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const SERVER_PORT = process.env.SERVER_PORT;

// express.static.mime.define({ "text/css": ["css"] });

app.use("/", express.static(path.resolve(__dirname, "../client")));

type callbackfunction = (p: any) => any;

wss.on("connection", (ws: WebSocket) => {
  let game = new ServerGame();

  let messageMap = new Map<string, callbackfunction>([
    [
      "create",
      () => {
        // game.create
        game = new ServerGame();
        return true;
      },
    ],
    ["check", game.check],
    ["getHints", game.getHints],
    ["newGame", game.newGame],
  ]);

  ws.on("message", (message: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      let result = JSON.parse(message);
      let action = messageMap.get(result.type);

      if (action) {
        let res = { seq: result.seq, data: action.call(game, result.data) };
        ws.send(JSON.stringify(res));
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
