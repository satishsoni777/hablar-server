import mysql from "mysql"
// Create a MySQL connection pool

class MySqlConnection {
    static instance = new MySqlConnection();
    constructor() {

    }
    connectMySql(pool) {
        pool.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }
    createConnection(params) {
        // const pool = mysql.createConnection({
        //     host: 'localhost',
        //     user: 'satish754ss',
        //     password: 'Test@123',
        //     database: 'Users'
        // });
        // this.connectMySql(pool);
    }

}




export { MySqlConnection }