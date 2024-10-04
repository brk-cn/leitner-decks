import express from "express";
import mongoose from "mongoose";
import path from "path";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(""), "public")));
app.set("view engine", "pug");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB ++"))
  .catch((err) => console.error("MongoDB --", err));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
