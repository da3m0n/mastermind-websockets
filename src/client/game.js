function makeUrl(name) {
  let url = window.location.protocol === "http:" ? "ws://" : "wss://";
  return url + window.location.host + "/" + name;
}

const url = makeUrl("myWebsocket");
const wss = new WebSocket(url);

let checkNumbers = () => {
  wss.send("this is a message from checkNumbers");
};

let generateNumbers = () => {
  console.log("generateNumbers...");
  let data = { type: "getCode" };
  wss.send(JSON.stringify(data));
};

wss.onmessage = (data) => {
  console.log(data.data);
};

class Game {
  constructor() {
    let board = new Board(6, 4);
    board.makeBoard();
  }
}
