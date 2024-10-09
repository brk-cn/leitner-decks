import express from "express";
import * as deckController from "../controllers/deck.controller.js";

const router = express.Router();

router.get("/decks/:id", deckController.getDeckById);
router.post("/decks/:id/update", deckController.updateDeck);

export default router;
