import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// body parser
app.use(express.json()); //// Parses incoming JSON data from the request body.
app.use(express.urlencoded()); //Parse form data from the request body

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
