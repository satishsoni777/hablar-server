import { WebSocketServer } from 'ws';
async function connectToWebsocket(httpServer) {
    const ws = new WebSocketServer({ server: httpServer, path: "" });
    console.log("connectSocket connectSocket");


    ws.on("headers", (headers, req) => {
        console.log("");
    });
    ws.on('connection', function connection(ws) {
        console.log("Websocket conneced")
        ws.emit(JSON.stringify({
            "status": "connected",
            "error": false
        }));

        ws.send(JSON.stringify({
            "status": "connected..",
            "error": false
        }));

        ws.on("message", function message(msg) {
            console.log("message ", msg.toString())
            const type = JSON.parse(msg);
            if (type.call) {
                ws.send(JSON.stringify({
                    "data": "connnection"
                }))
            }
        })

        ws.on("upgrade", function upgrade(data) {
            console.log('@#$#@# upgrade @#@#$', data);
        });
        ws.on("ping", function ping(data) {
            console.log(data);
        });
        ws.on("pong", function pong(data) {
            console.log(data);
        })

        ws.on('disconnect', function disconnect(data) {
            console.log('client disconnected $', data);
            ws.send(JSON.stringify({
                "status": "disconnect"
            }))
        });
        ws.on("close", function close(data) {
            console.log("Ws clsoed", data);
            ws.send(JSON.stringify({
                "status": "close"
            }))
        })
        ws.on("error", function (data) {
            console.log("##@@# error @##@", data);
        })
        ws.on("unexpected-response", function (data) {
            console.log("##@@# unexpected-response @##@", data);
        });

    });
}
export { connectToWebsocket }