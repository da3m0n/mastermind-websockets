"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import generateRandomNumbers from "./game";
const game_1 = require("./game");
// // import { config } from "./config/config";
//
dotenv_1.default.config();
//
const app = (0, express_1.default)();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const SERVER_PORT = process.env.SERVER_PORT;
// express.static.mime.define({ "text/css": ["css"] });
app.use("/", express_1.default.static(path_1.default.resolve(__dirname, "../client")));
wss.on("connection", (ws) => {
    let game = new game_1.ServerGame();
    let messageMap = new Map([
        [
            "create",
            () => {
                // game.create
                game = new game_1.ServerGame();
                return true;
            },
        ],
        ["check", game.check],
        ["getHints", game.getHints],
        ["newGame", game.newGame],
    ]);
    ws.on("message", (message) => {
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
function generateRandomNumbers(n) {
    const array = [];
    for (let i = 0; i < n; i++) {
        array.push(Math.floor(Math.random() * n) + 1);
    }
    return array;
}
//# sourceMappingURL=server.js.map