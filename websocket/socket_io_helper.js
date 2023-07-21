/**
*
* send to all who joined room1 exlcude sender
*/
function sendAllExcludeSenderIO(socket, params) {
    const { roomId, event, payload } = params;
    socket.broadcast.to(roomId).emit(event, payload);
}

/**
* Send IO event.
*
* To all clients in room1
*/
function IoToAllClinetsInARooom(io, params) {
    const { roomId, event, payload } = params;
    io.in(roomId).emit(event, payload);
}

/* 
To individual socketid (private message)
*/
function toASocketId(io, params) {
    const { event, payload, socketId } = params;
    io.to(socketId).emit(event, payload);
}

export const SokcetIOHelper = { sendAllExcludeSenderIO, toASocketId, IoToAllClinetsInARooom }