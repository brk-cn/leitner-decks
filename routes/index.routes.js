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
      const deckCards = cards.filter((card) => card.deckNo === deck.deckNo);
      const cardCount = deckCards.length;
      const reviewedCardCount = deckCards.filter((card) => card.reviewed).length;

      let remainingMins = null;

      if (deck.nextReviewDate) {
        remainingMins = moment(deck.nextReviewDate).diff(now, "minutes");
      }

      return {
        deckNo: deck.deckNo,
        cardCount: cardCount,
        reviewedCardCount: reviewedCardCount,
        remainingMins: remainingMins,
        nextReviewDate: deck.nextReviewDate,
      };
    });
    res.render("index", { decksData });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the decks and cards");
  }
});

export default router;
