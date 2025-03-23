/*
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

module.exports = { connection };*/
const { Pool } = require('pg');
const connection = new Pool({
    connectionString: "postgresql://postgres.hbpqqnkfuzujsxhhdagd:$HarshulSoni04@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false // Required for Supabase connections
    }
});

connection.connect()
    .then(() => console.log("✅ Connected to Supabase PostgreSQL database"))
    .catch(err => console.error("❌ Connection error:", err));

module.exports = { connection };