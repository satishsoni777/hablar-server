import { Server } from "socket.io";
import { meetingServer } from "./src/service/meeting.socket.service.js";
import { LiveUsers } from "./src/models/live_users.js";

async function connectSocketIo(httpServer) {
    console.log("socket connection");
    const io = new Server(httpServer
    );
    console.log("Connecting socket")

    io.on("connection", async (socket) => {

        console.log("connection {1}", socket.handshake.query.userId);
        const userId = socket.handshake.query.userId;


        meetingServer.saveUserSocketId(socket);

        meetingServer.listenMessage(socket, httpServer, io)


        console.log(`Socket io Connected `)

        // socket.on("message", (message) => {
        //     console.log("IO message", message, printDateTime());
        //     socket.emit("message", { "test-data": "sd" })
        // });

        // socket.on("joinChannel", (data) => {
        //     console.log("joined", socket);
        //     liveUsers[data.emailId] = socket.id;
        //     console.log(liveUsers);
        // })


        // socket.on("voiceMessageFromClient", (data) => {
        //     console.log(data.emailId);
        //     // eslint-disable-next-line no-undef
        //     // const d = Buffer.from(JSON.stringify(data.voiceMessageFromClient));
        //     const socketId = liveUsers[data.emailId];
        //     console.log("voiceMessageFromClient Socket ", socketId);
        //     io.to(socketId).emit("voiceMessageToClient", data.voiceMessageFromClient);
        // });


        // socket.on("messageFromClient", (data) => {
        //     console.log("test event data", data);
        // });

        // socket.on("messageToClient", (data) => {
        //     console.log("test event data", data);
        // });

        socket.on("close", async (close) => {
            const user = await LiveUsers.findOneAndUpdate({ userId: userId }, { online: false });
            console.log("disconnect ", user)
            user.save();
        })

        socket.on("disconnect", async (close) => {
            const user = await LiveUsers.findOneAndUpdate({ userId: userId }, { online: false });
            console.log("disconnect ", user)
            user.save();
        })
        // if you need the certificate details (it is no longer available once the handshake is completed)
    });

}
export { connectSocketIo }