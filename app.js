import express from "express";
import mongoose from "mongoose";
import cardRoutes from "./routes/card.routes.js";
import deckRoutes from "./routes/deck.routes.js";
import indexRoutes from "./routes/index.routes.js";
import { createDecks } from "./controllers/deck.controller.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB ++"))
  .catch((err) => console.error("MongoDB --", err));

createDecks();

app.use("/", indexRoutes);
app.use("/cards", cardRoutes);
app.use("/decks", deckRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
