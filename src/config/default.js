export const Config = {
    port: 1337,
    host: "localost",
    localDbUrl: "mongodb://127.0.0.1:27017/webrtc",
    db: "webrtc",
    removeDbUrl: "mongodb+srv://Test123:Test123@cluster0.kidai.mongodb.net/webrtc?retryWrites=true&w=majority",
    TOKEN_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
export class Flavor {
    constructor() {

    }
    static getMongoBaseUrl = () => {
        console.log("#### NODE_ENV ###", process.env.NODE_ENV);

        let url = "mongodb+srv://Test123:Test123@cluster0.kidai.mongodb.net/webrtc?retryWrites=true&w=majority";
        switch (process.env.NODE_ENV) {
            case Environment.stg:
                url = "mongodb+srv://Test123:Test123@cluster0.kidai.mongodb.net/webrtc?retryWrites=true&w=majority";
                break;
            case Environment.local:
                url = "mongodb://127.0.0.1:27017/webrtc";
                break;
        }
        console.log("#### Mongo Url ###", url);
        return url;
    }
}
class Environment {
    constructor() { }
    static stg = "stg";
    static local = "local"
}
