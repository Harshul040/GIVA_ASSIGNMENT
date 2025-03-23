
const { Pool } = require('pg');

const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'harshul',  // Correct database name
    password: '$HarshulSoni04',  // Replace with your PostgreSQL password
    port: 5432
});

connection.connect()
    .then(() => console.log("Connected to PostgreSQL database 'harshul'"))
    .catch(err => console.error("Connection error:", err));

module.exports = { connection };


