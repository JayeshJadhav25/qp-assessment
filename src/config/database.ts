import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "groceries",
};

const db = mysql.createPool(dbConfig);

// Function to check if the database connection is successful
export async function checkDatabaseConnection(): Promise<void> {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
  }
}

export default db;
