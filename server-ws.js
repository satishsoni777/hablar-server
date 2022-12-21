import { WebSocketServer } from 'ws';
import http from "http";

const server = http.createServer((req, res) => {
    res.sendDate("I am connected")
});

const ws = new WebSocketServer({ server })

ws.on("headers", (headers, req) => {
    console.log(req);
});

ws.on('connection', function connection(ws) {
    ws.send('Ws socket connected', ws);
    ws.on("message", function message(msg) {
        const type = JSON.parse(msg);
        if (type.call) {
            ws.send(JSON.stringify({
                "data": "connnection"
            }))
        }
    })
});

server.listen(8080);