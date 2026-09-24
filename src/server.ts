import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("This is a TypeScript Express server running on Node.js!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
