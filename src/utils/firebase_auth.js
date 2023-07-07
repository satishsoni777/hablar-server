// import admin from "firebase-admin";
// import { readFile } from 'fs/promises';
// const json = {
//     "type": "service_account",
//     "project_id": "makeiteasy-fc51f",
//     "private_key_id": "8346d6e0fb34d859de5db586d81f0c26ec3159a4",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvnKscFWUhOszp\ntQzeCt29U2Px1nfEQTqHeyhVA2ltPoI9U+Smtymh6C9dQn8XPe+ZO6rNTJuaJmXu\na6jI19ymTY/u07iWQfGNK7/eqO4I9cloeR/swOj+nlH26EqJ9gZSSru6HRK+74Bh\n8YO87EhBUuzOdSpgTxf1FJkpMof9N2+M/2Xxz7FwzHdGTQNnPQ+uzUp5iqmi7tD6\nWd5ULLT56/lY4g4cpFut+LJ9Ysef6orsnGP6Ljpxc05mnEwaoFtiTUdmKaTXeTX0\nM8T+fjkHYteoivi8lONLEeCeAfqgN8ubeWQILwe60+XKhRa/jRyLccfwV8zxYhqZ\ncEyUXWE1AgMBAAECggEAF60X7bKdvpfqohSwjiwpXpnkVunbHljL/xGV67ZIy7t6\nfDG4GVkG8ib3YcuyDkxhpgdjHQg3z1XfdsBJkoB15W7+GY0ubQWpfya3mNmuNAON\nOrpf2T/d+dwXAWKqkASdMBGW0z4Rta/dH3dcE0fI6xO2zRQDWVY4jOiQyLrhFjye\nrLhFaRIe5a7yU8SeG2HqL+GtXE26eh09EoZYJ+cZWDFc2Yn6nzKd5w4WSPA4Bo3v\nSHivp8xCZkSdmNZQuLrk6wYCkLQimAMy9VQcH3BjtFHN7X5WDyYThJlIA5eZ4lJy\ncB03c6ZS3dsPzJXJswOVJ+S5Zf1eMsuaGNmq2sS8aQKBgQDYMoq7Hxv4mFe3Xwjw\nfrUCmHJ9/fTfhKMc7h6PBCKmbposY3s+75fyw5Q3ghHaTNi+CqP+KX93h/qHKOfX\n0LiPzuID84UtnPioqdCbANhse10bi/jugd7jW3sCn6dkRiP5ZLf9W4M34mJ7E2b3\ncG0Q0kZCe6X6v6MXihb4NN/TiQKBgQDP8VIexWq7c5j80DZLIX38+Dn6xna6t2X7\n3V6z3T9PRObCBE5YD99u6lIDveK070l2ajXgC9znGUbywpmsj4Kd0oKe2/2OlXoO\nNpqbDNJvcVhWZlfUzZ2bUkVIV+gdZ8s8WSRmjiPPqpwILjAR+QBb0ghRUdFRFcGu\nPCuJ6td5TQKBgFEER6atlr7G4AAQdfohkVViqWz7cPsd6j4aIYt4gj+aLN47fWDt\nSiSoE+/lJymGKKa2uBOzm1fAtipWMuNWDQOfBGV0qVCZhTk3QbwEShYE+LQs9ODz\n/AF5M5SdHY5fFnYLv0MLOxYDGOKEN86767MlCT06ts1LaSOWFNt4fPP5AoGABhn7\noeGDDzsGGyz02uGBs+GIuf4Gz9W/zVMiiz6LtAS+jKTZs6XLlZKUk32H4G1BB5N4\nPzm54qIQPeFN5w1S9NSPdp/X4c4rBa2+fZwztIdr4yUfoKPj4wHX/JZvviUkhoHL\nGqNDE73a1DaevHhE9WzFR7WR4cI0q6siT+qvJeUCgYBA6210WsIj3uLNqFMSuE9O\nC4yuLtb2AXjGNBfEf/+ILZ8qWjnALA7q2SQfN+tVtqvYY6CbZw4EZ2GXR/JMfdrl\nnkMPvCCgdfMpuVRl/ZoP8KZZQlJLdwtdDPH9/XEtTnyCvkyW8+dykFJ7exvS/oyj\nUJfL8zopYqNkfhSpirk0sQ==\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-o1aet@makeiteasy-fc51f.iam.gserviceaccount.com",
//     "client_id": "104493071573620772452",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o1aet%40makeiteasy-fc51f.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
// }
// const firebaseOtpAuth = async (req, res) => {
//     console.log("firebaseOtpAuth ##", req.body)
//     const { mobile } = req.body;
//     admin.initializeApp({
//         credential: admin.credential.cert(json),
//         databaseURL: "https://makeiteasy-fc51f-default-rtdb.firebaseio.com"
//     });
//     return sendOtp(mobile, res);
// }
// const sendOtp = (phoneNumber, res) => {
//     console.log("send Otp", phoneNumber)
//     admin
//         .auth()
//         .createUser(phoneNumber)
//         .then((userRecord) => {
//             console.log("userRecord", userRecord);
//             // Generate the OTP code
//             const otpCode = generateOTP();
//             // Create a custom token for the user
//             return admin.auth().createCustomToken(userRecord.uid, { otp: otpCode });
//         })
//         .then((customToken) => {
//             console.log("phoneNumber", phoneNumber);
//             // Send the custom token to the user via SMS using your preferred SMS service or provider
//             return res.send(
//                 {
//                     success: true,
//                     "message": "Otp sent"
//                 }
//             );
//         })
//         .catch((error) => {
//             console.error('Error sending OTP:', error);
//             return res.send({
//                 error: error
//             })
//         });
// }
// function generateOTP() {
//     const digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < 6; i++) {
//         otp += digits[Math.floor(Math.random() * 10)];
//     }
//     return otp;
// }



// // async function readJSONFile() {
// //     // const filePath = require("./serviceAccountKey.json");
// //     try {
// //         const fileData = await readFile(filePath, 'utf8');
// //         const jsonData = JSON.parse(fileData);
// //         console.log(jsonData);
// //         return jsonData;
// //     } catch (error) {
// //         console.error('Error reading JSON file:', error);
// //     }
// // }






// const FirebaseAuth = { firebaseOtpAuth };
// export { FirebaseAuth };