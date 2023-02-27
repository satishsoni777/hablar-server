import { Server } from "socket.io";
import { printDateTime } from './src/utils/date_util.js'
import {meetingServer} from "./meeting_server.js";

const liveUsers=new Map();
async function connectSocketIo(httpServer) {
    const io = new Server(httpServer, {
        path: "/socket.io",
        serveClient: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false

    },
    )
    io.on("connection", (socket) => {
      console.log(socket);
       const meetingId=socket.handshake.query.id;

       meetingServer.listenMessage(meetingId,socket,httpServer)

      liveUsers["email_id"]=socket.id;
       
       console.log(`Socket io Connected `,liveUsers)

        socket.on("message", (message) => {
            console.log("IO message", message.textMessageFromClient, printDateTime());
            socket.emit("callData", { "test-data": "sd" })
        });
        socket.on("joinChannel",(data)=>{
            console.log("joined",socket);
            liveUsers[data.email_id]=socket.id;
            console.log(liveUsers);
        })


        socket.on("voiceMessageFromClient", (data) => {
            console.log(data.email_id);
            // eslint-disable-next-line no-undef
            // const d = Buffer.from(JSON.stringify(data.voiceMessageFromClient));
            const socketId=liveUsers[data.email_id];
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