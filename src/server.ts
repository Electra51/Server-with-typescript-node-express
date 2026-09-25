import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();

// body parser
app.use(express.json()); //// Parses incoming JSON data from the request body.
app.use(express.urlencoded()); //Parse form data from the request body

//db
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// table creation
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("This is a TypeScript Express server running on Node.js!");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: "POST request received successfully!",
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
