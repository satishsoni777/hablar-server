import { Server } from "socket.io";
import { meetingServer } from "./src/service/call_service/call_socket_service.js";
import { WaitingRoom } from "./src/models/voice_stream/waiting_room.js";

async function connectSocketIo(httpServer) {
    const io = new Server(httpServer);
    console.log("Connecting socket")
    global.IO = io;
    io.on("connection", async (socket) => {

        console.log("Socket connected");

        const userId = socket.handshake.query.userId;

        meetingServer.waitingRooms(socket);

        meetingServer.listenMessage(socket, httpServer, io)

        socket.on("close", async (_) => {
            const user = await WaitingRoom.findByIdAndDelete({ userId: userId });
            console.log("close ", user)
            await user.save();
        })

        socket.on("disconnect", async (_) => {
            const user = await WaitingRoom.findByIdAndDelete({ userId: userId });
            console.log("socket disconnected ", user)
            await user.save();
        })
    });

}
export { connectSocketIo }