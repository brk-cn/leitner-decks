import express from "express";
import * as deckController from "../controllers/deck.controller.js";

const router = express.Router();

router.get("/:no", deckController.showDeckByNo);
router.post("/:id/update", deckController.updateDeck);
router.post("/overdue-update", deckController.updateOverdueDecks);

export default router;
