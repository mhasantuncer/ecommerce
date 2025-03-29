// Import and access enironmental variables
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
});

export const connectDB = async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Crash immediately if DB is essential
    process.exit(1);
  }
};
