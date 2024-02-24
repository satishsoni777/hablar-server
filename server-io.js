import { Server } from "socket.io";
import { SocketService } from "./src/webserver/events_handler.js";
import { AuthTokenMiddleware } from './middleware/auth_middleware.js'

function connectSocketIo(httpServer) {
    try {

        const io = new Server(httpServer, {
            path: ""
        });

        io.use((socket, next) => {
            var result = AuthTokenMiddleware.authMiddleware(socket.handshake.query, socket.handshake.headers);
            httpServer._events.request.userId = result.userId;
            if (result == null) {
                return next(new Error('Authentication token not providen'));
            }
            else if (result && result.isValide == true) {
                return next();
            }
            // If the token is invalid, reject the connection
            return next(new Error('Authentication failed: Invalid token'));
        });

        console.log("Connecting socket...",)

        global.IO = io;

        io.on("connection", async (socket) => {
            var userId = httpServer._events.request.userId;
            httpServer._events.request.roomId = socket.handshake.query.roomId;
            SocketService.connection(userId, socket);

            socket.on("close", async (e) => {
                SocketService.close(socket, io);
            })
            socket.on("disconnect", async () => {
                console.log("disconnect socket")
                SocketService.disconnect(socket, io);
            },)
            SocketService.listenMessage(socket, io)

        });
    }
    catch (e) { }
}

const SocketIO = { connectSocketIo };
export { SocketIO }