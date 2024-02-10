import { Server } from "socket.io";
import { SocketService } from "./src/webserver/events_handler.js";
import { AuthTokenMiddleware } from './middleware/auth_middleware.js'
import { LiveUser } from "./src/module/signaling/models/live_users.js";
import { Rooms } from "./src/module/signaling/models/rooms.js";
import { WaitingRoom } from "./src/module/signaling/models/waiting_room.js";
import { SignalingController } from "./src/module/signaling/controller/signaling_controller.js";
import { SignalingHelper } from "./src/webserver/signaling_helper.js";

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
                try {
                    const filter = { userId: userId };
                    const update = { socketId: "", online: false, lastActive: new Date().toISOString() };
                    const [deletedRoom, updatedUser, waitingRoom] = await Promise.all([
                        SignalingHelper.leaveRoom(io, { userId: _.userId, roomId: _.roomId }),
                        LiveUser.findOneAndUpdate(filter, update, { new: true }),
                        WaitingRoom.findOneAndDelete(filter)
                    ]);

                    // Log results
                    if (deletedRoom) {
                        console.log('Room deleted:', deletedRoom);
                    } else {
                        console.log('No room found for deletion.');
                    }

                    if (updatedUser) {
                        console.log('User updated:', updatedUser);
                    }
                    if (waitingRoom) {
                        console.log('waitingRoom updated:', waitingRoom);
                    }
                    else {
                        console.log('No user found for update.');
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            })

            socket.on("disconnect", async (_) => {
                SocketService.disconnect(socket, io);
                console.log("User disconnect", userId, _)
                try {
                    const filter = { userId: userId };
                    const update = { socketId: "", online: false, lastActive: new Date().toISOString() };
                    const [deletedRoom, updatedUser, waitingRoom] = await Promise.all([
                        SignalingHelper.leaveRoom(io, { userId: _.userId, roomId: _.roomId }),
                        LiveUser.findOneAndUpdate(filter, update, { new: true }),
                        WaitingRoom.findOneAndDelete(filter)
                    ]);

                    // Log results
                    if (deletedRoom) {
                        console.log('Room deleted:', deletedRoom);
                    } else {
                        console.log('No room found for deletion.');
                    }

                    if (updatedUser) {
                        console.log('User updated:', updatedUser);
                    }
                    if (waitingRoom) {
                        console.log('waitingRoom updated:', waitingRoom);
                    }
                    else {
                        console.log('No user found for update.');
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            },)
            SocketService.listenMessage(socket, io)

        });
    }
    catch (e) { }
}

const SocketIO = { connectSocketIo };
export { SocketIO }