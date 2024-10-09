import express from "express";
import Card from "../models/card.model.js";
import Deck from "../models/deck.model.js";
import moment from "moment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find();
    const cards = await Card.find();
    const now = moment();

    const decksData = decks.map((deck) => {
      const cardCount = cards.filter((card) => card.deckNo === deck.deckNo).length;
      let remainingHours = null;

      if (deck.nextReviewDate) {
        remainingHours = moment(deck.nextReviewDate).diff(now, "hours");
      }

      return {
        deckNo: deck.deckNo,
        cardCount: cardCount,
        remainingHours: remainingHours,
      };
    });
    res.render("index", { decksData });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the decks and cards");
  }
});

export default router;
