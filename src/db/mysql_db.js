import mysql from "mysql"
// Create a MySQL connection pool

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'satish754ss',
    password: 'Test@123',
    database: 'Users'
});

const connectMySql = async () => {
    pool.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

export { connectMySql }