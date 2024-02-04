import { Server } from "socket.io";
import { SocketService } from "./src/webserver/events_handler.js";
// import { WaitingRoom } from "./src/models/signalling/waiting_room.js";
import { AuthTokenMiddleware } from './middleware/auth_middleware.js'
import { LiveUser } from "./src/module/signalling/models/live_users.js";
import { Rooms } from "./src/module/signalling/models/rooms.js";
// import { Rooms } from "./src/models/signalling/rooms.js";

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
            console.log("asdfdsfgddsf ", r);

            // If the token is invalid, reject the connection
            return next(new Error('Authentication failed: Invalid token'));
        });

        console.log("Connecting socket...",)

        global.IO = io;

        io.on("connection", async (socket) => {

            console.log("Socket connected");

            var userId = httpServer._events.request.userId;
            userId = Number(userId);
            socket.handshake.query.userId = userId;
            const filter = { userId: userId };
            const update = { socketId: socket.id, online: true, userId: userId };
            const options = { new: true, upsert: true };
            LiveUser.findOneAndUpdate(
                filter,
                update,
                options,
                (err, user) => {
                    if (err) {
                        console.error('Error updating user online status:', err);
                    } else {
                        console.log('User online status updated:', user);
                    }
                }
            );
            socket.on("close", async (_) => {
                // const userId = socket.handshake.query.userId;
                console.log("Closed", userId)
                // try {
                //     await WaitingRoom.findByIdAndDelete({ userId: userId });
                //     await Rooms.findOneAndDelete({ hostId: userId })
                // }
                // catch (_) { }
                const filter = { userId: userId };
                const update = { socketId: socket.id, online: false, userId: userId };
                LiveUser.findOneAndUpdate(
                    filter,
                    update,
                    (err, user) => {
                        if (err) {
                            console.error('Error updating user online status:', err);
                        } else {
                            console.log('User online status updated:', user);
                        }
                    }
                );
            })

            socket.on("disconnect", async (_) => {
                SocketService.disconnect(socket, io);
                console.log("User disconnect", userId)
                try {
                    const filter = { userId: userId };
                    const update = { socketId: socket.id, online: false, userId: userId };
                    const [deletedRoom, updatedUser] = await Promise.all([
                        Rooms.findOneAndDelete({ hostId: userId }),
                        LiveUser.findOneAndUpdate(filter, update, { new: true })
                    ]);

                    // Log results
                    if (deletedRoom) {
                        console.log('Room deleted:', deletedRoom);
                    } else {
                        console.log('No room found for deletion.');
                    }

                    if (updatedUser) {
                        console.log('User updated:', updatedUser);
                    } else {
                        console.log('No user found for update.');
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            })
            SocketService.listenMessage(socket, io)

        });
    }
    catch (e) { }
}

const SocketIO = { connectSocketIo };
export { SocketIO }