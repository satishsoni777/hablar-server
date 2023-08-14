
/*
* Send socket event.
* send to all who joined room1 exlcude sender
*/
function sendAllExcludeSender(socket, event, params) {
    const { roomId, payload } = params;
    socket.broadcast.to(roomId).emit(event, payload);
}

/*
* Send IO event.
*
* To all clients in room1
*/
function ioToAllClinetsInARooom(io, event, params) {
    const { roomId, payload } = params;
    io.in(roomId).emit(event, payload);
}

/* 
* Send IO event.
* P2P communication
* To individual socketid (private message)
*/
function toASocketId(io, event, params) {
    const { payload } = params;
    io.to(payload.socketId).emit(event, payload);
}
// to all clients in room1
// io.in("room1").emit(/* ... */);
export const SocketIoHelper = { sendAllExcludeSender, toASocketId, ioToAllClinetsInARooom }