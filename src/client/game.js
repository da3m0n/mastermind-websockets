function makeUrl(name) {
  let url = window.location.protocol === "http:" ? "ws://" : "wss://";
  return url + window.location.host + "/" + name;
}

class MessageHandler {
  constructor() {
    const url = makeUrl("myWebsocket");
    this.wss = new WebSocket(url);
    this.seq = 0;
    this.pending = new Map();
    this.wss.onmessage = (data) => {
      let res = JSON.parse(data.data);
      let handler = this.pending.get(res.seq);
      if (handler) {
        handler(null, res.data);
      }
    };
  }
  rpc(name, data) {
    let seq = this.seq++;

    return new Promise((resolve, reject) => {
      this.pending.set(seq, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
      this.wss.send(JSON.stringify({ type: name, data, seq }));
    });
  }
}
let messages = new MessageHandler();
3;

let checkNumbers = async (nums) => {
  let answer = await messages.rpc("check", nums);
  console.log("checking these...", nums);
  return answer;
};

let generateNumbers = () => {
  console.log("generateNumbers...");
  let data = { type: "getCode" };
  wss.send(JSON.stringify(data));
};

class Game {
  constructor() {
    let board = new Board(6, 4);
  }
}
