import express from "express";
import Card from "../models/card.model.js";
import Deck from "../models/deck.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find();
    const cards = await Card.find();

    const deckCardCount = decks.map((deck) => {
      const count = cards.filter((card) => card.deckNo === deck.deckId).length;
      return {
        deckId: deck.deckId,
        count: count,
      };
    });

    res.render("index", { decks, deckCardCount });
  } catch (error) {
    console.error("Error fetching decks and cards:", error);
    res.status(500).send("Error fetching decks and cards");
  }
});

router.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.render("cards", { cards });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the cards");
  }
});

router.get("/cards/add", (req, res) => {
  res.render("add-card");
});

router.post("/cards", async (req, res) => {
  try {
    const { word, word_type, context, translation } = req.body;

    const newCard = new Card({
      word,
      word_type,
      context,
      translation,
    });

    await newCard.save();
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while adding the card");
  }
});

export default router;
