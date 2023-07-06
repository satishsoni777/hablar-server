import { axios } from 'axios';
const BASE_URL = "http://localhost:3000/";
// Test HTTP endpoint
test('GET /authentication/signIn', async () => {
    console.log("test start");
    for (const i = 0; i < 100; i++) {
        const response = await axios.post(`${BASE_URL}/authentication/signIn`,
            {
                "name": "satish kumaar",
                "emailId": `satishsa123${i}@gmail.com`,
                "state": "Jharkhand",
                "pin": 8282021,
                "authType": "MOBILE_OTP",
                "mobileNumber": "7829097550"
            }
        );
    }
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
});



// // Test WebSocket functionality
// describe('WebSocket Tests', () => {
//     test('WebSocket Connection', (done) => {
//         const ws = new WebSocket('ws://localhost:4000');

//         ws.on('open', () => {
//             // Send a message to the WebSocket server
//             ws.send('Hello, WebSocket!');

//             // Listen for a message from the WebSocket server
//             ws.on('message', (message) => {
//                 expect(message).toBe('WebSocket Server Received: Hello, WebSocket!');
//                 ws.close();
//                 done();
//             });
//         });
//     });
// });