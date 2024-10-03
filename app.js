import express from "express";
import mongoose from "mongoose";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB ++"))
  .catch((err) => console.error("MongoDB --", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
