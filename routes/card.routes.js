import express from "express";
import * as cardController from "../controllers/card.controller.js";

const router = express.Router();

router.get("/", cardController.getCards);
router.get("/add", cardController.showAddCardPage);
router.post("/add", cardController.addNewCard);
router.get("/edit/:id", cardController.showEditCardPage);
router.post("/edit/:id", cardController.editCard);
router.post("/delete/:id", cardController.deleteCard);
router.post("/update/:id", cardController.updateCard);
router.get("/:deckno", cardController.getUnreviewedCardsByDeckNo);

export default router;
