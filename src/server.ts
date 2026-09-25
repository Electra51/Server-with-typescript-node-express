import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();

// body parser
app.use(express.json()); //// Parses incoming JSON data from the request body.
app.use(express.urlencoded({ extended: true })); //Parse form data from the request body

//db
const pool = new Pool({
  connectionString: config.databaseUrl,
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

//get api
app.get("/", (req: Request, res: Response) => {
  res.send("This is a TypeScript Express server running on Node.js!");
});

//post api for user create
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, age, phone, address],
    );

    console.log("result:", result?.rows[0]);

    res.status(201).json({
      success: true,
      message: "User created successfully!", //success message
      data: result?.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
