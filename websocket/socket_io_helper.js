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
    console.log("ioToAllClinetsInARooom", params, event, io)
    const { roomId, payload } = params;
    io.in(roomId).emit(event, payload);
}

/* 
* Send IO event.
* To individual socketid (private message)
*/
function toASocketId(io, event, params) {
    const { payload, socketId } = params;
    io.to(socketId).emit(event, payload);
}

export const SokcetIOHelper = { sendAllExcludeSender, toASocketId, ioToAllClinetsInARooom }