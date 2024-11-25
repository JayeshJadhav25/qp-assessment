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

// Queries to create tables
const createTablesQueries = [
  `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS grocery_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price FLOAT NOT NULL,
      quantity INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_price FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      grocery_item_id INT NOT NULL,
      quantity INT NOT NULL,
      price FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (grocery_item_id) REFERENCES grocery_items(id) ON DELETE CASCADE
    );
  `
];

// Function to create all tables
export async function checkDatabaseConnection(): Promise<void> {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");

    for (const query of createTablesQueries) {
      await connection.query(query);
    }

    console.log("All tables are ready!");
    connection.release();
  } catch (error: any) {
    console.error("Error setting up tables:", error.message);
  }
}

export default db;
