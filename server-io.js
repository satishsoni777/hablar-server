import { Server } from "socket.io";
import { MeetingServer } from "./src/service/random_call_service/call_socket_service.js";
// import { WaitingRoom } from "./src/models/voice_stream/waiting_room.js";
import { AuthTokenMiddleware } from './middleware/auth_middleware.js'
// import { Rooms } from "./src/models/voice_stream/rooms.js";

function connectSocketIo(httpServer) {

    try {
        const io = new Server(httpServer);
        io.use((socket, next) => {
            // Get the token from the query parameters sent by the client
            const token = socket.handshake.headers.authorization;
            // Validate the token (you can use your own authentication logic here)
            const result = AuthTokenMiddleware.authMiddleware(token);
            if (result == null) {
                return next(new Error('Authentication token not providen'));
            }
            else if (result && result.isValide == true) {
                // If the token is valid, proceed with the connection
                return next();
            }
            // If the token is invalid, reject the connection
            return next(new Error('Authentication failed: Invalid token'));
        });

        console.log("Connecting socket...",)

        global.IO = io;

        io.on("connection", async (socket) => {

            console.log("Socket connected");

            const userId = socket.handshake.query.userId;

            MeetingServer.liveUsers(socket);

            MeetingServer.listenMessage(socket, httpServer, io)

            socket.on("close", async (_) => {
                // const userId = socket.handshake.query.userId;
                console.log("Closed", userId)
                // try {
                //     await WaitingRoom.findByIdAndDelete({ userId: userId });
                //     await Rooms.findOneAndDelete({ hostId: userId })
                // }
                // catch (_) { }
            })
            socket.on("disconnect", async (_) => {
                // const userId = socket.handshake.query.userId;
                console.log("disconnect", userId)
                // try {
                //     await WaitingRoom.findOneAndDelete({ userId: userId });
                //     await Rooms.findOneAndDelete({ hostId: userId })
                // }
                // catch (_) {
                // }
            })

        });
    }
    catch (e) { }
}
const SocketIO = { connectSocketIo };
export { SocketIO }