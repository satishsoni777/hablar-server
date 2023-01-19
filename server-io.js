import { Server } from "socket.io";
import {printDateTime} from './src/utils/date_util.js'



async function connectSocketIo(httpServer) {
    const io = new Server(httpServer, {
        path:"/socket.io"
    },

    )
    io.engine.on("connection", (rawSocket) => {
        io.emit(JSON.stringify({
            "status": "connected",
            "error": false
        }));
        console.log("connection message", rawSocket.data);

        rawSocket.on("message", (message) => {

            console.log("IO message", message, printDateTime());

        });
        rawSocket.on("close", (close) => {
            console.log("close", close);
        })
        // if you need the certificate details (it is no longer available once the handshake is completed)
    });
}
export { connectSocketIo }