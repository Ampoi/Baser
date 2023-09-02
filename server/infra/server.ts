//サーバー関連
import express from "express"
import http from "http"
import { Server, Socket } from "socket.io"

//ファイル関連
import * as fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

//サーバー起動用
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientPath = path.resolve(__dirname, "../../dist")

//サーバー
app.get("*", (req: {url: string}, res: {sendFile(url: string): void}) => {
  if(fs.existsSync(`${clientPath}${req.url}`)){
    res.sendFile(`${clientPath}${req.url}`);
  }else{
    res.sendFile(`${clientPath}/404.html`)
  }
});

export const server = {
  onConnect(connectFunc: (socket: Socket)=>void){
    io.on("connection", connectFunc)
  },

  //全体へ送信
  sendData(name: string, value: any){
    io.emit(name, value)
  },

  createServer(PORT: number){
    httpServer.listen(PORT, () => {
      console.log(`📡server is running on http://localhost:${PORT}`);
    });
  }
}