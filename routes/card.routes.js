import express from "express";
import * as cardController from "../controllers/card.controller.js";

const router = express.Router();

router.get("/cards", cardController.getCards);
router.get("/cards/add", cardController.showAddCardPage);
router.post("/cards/add", cardController.addNewCard);
router.get("/cards/edit/:id", cardController.showEditCardPage);
router.post("/cards/edit/:id", cardController.editCard);
router.post("/cards/delete/:id", cardController.deleteCard);
router.post("/cards/update/:id", cardController.updateCard);
router.get("/cards/:deckno", cardController.getUnreviewedCardsByDeckNo);

export default router;
