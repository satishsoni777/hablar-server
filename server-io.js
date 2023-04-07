import { Server } from "socket.io";
import { printDateTime } from './src/utils/date_util.js'
import {meetingServer} from "./meeting_server.js";

async function connectSocketIo(httpServer) {
    const io = new Server(httpServer, {
        serveClient: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false

    },
    )
    io.on("connection", (socket) => {
        
        console.log("socket connection")

       const meetingId=socket.handshake.query.id;

       console.log("asasa",meetingId)
       
       meetingServer.listenMessage(meetingId,socket,httpServer)
       
       
       console.log(`Socket io Connected `)

        socket.on("message", (message) => {
            console.log("IO message", message, printDateTime());
            socket.emit("callData", { "test-data": "sd" })
        });
        socket.on("joinChannel",(data)=>{
            console.log("joined",socket);
            liveUsers[data.emailId]=socket.id;
            console.log(liveUsers);
        })


        socket.on("voiceMessageFromClient", (data) => {
            console.log(data.emailId);
            // eslint-disable-next-line no-undef
            // const d = Buffer.from(JSON.stringify(data.voiceMessageFromClient));
            const socketId=liveUsers[data.emailId];
            console.log("voiceMessageFromClient Socket ",socketId);
            io.to(socketId).emit("voiceMessageToClient",data.voiceMessageFromClient);
        });


        socket.on("textMessageFromClient", (data) => {
            console.log("test event data", data);
        });

        socket.on("textMessageToClient", (data) => {
            console.log("test event data", data);
        });


       
        socket.on("disconnect", (close) => {
            console.log(`close ${socket.id}`);
        })


        // if you need the certificate details (it is no longer available once the handshake is completed)
    });
}
export { connectSocketIo }