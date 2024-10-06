import moment from "moment";
import express from "express";
import Card from "../models/card.model.js";
import Deck from "../models/deck.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find();
    const cards = await Card.find();
    const now = moment();

    const decksData = decks.map((deck) => {
      const count = cards.filter((card) => card.deckNo === deck.deckId).length;
      let remainingHours = null;
      if (deck.nextReviewDate) {
        remainingHours = moment(deck.nextReviewDate).diff(now, "hours");
      }

      return {
        deckId: deck.deckId,
        count: count,
        remainingHours: remainingHours,
      };
    });
    res.render("index", { decksData });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the decks and cards");
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

router.get("/cards/edit/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    res.render("edit-card", { card });
  } catch (err) {
    res.status(500).send("An error occurred while fetching the card");
  }
});

router.post("/cards/edit/:id", async (req, res) => {
  const { word, word_type, context, translation } = req.body;
  try {
    await Card.findByIdAndUpdate(req.params.id, {
      word,
      word_type,
      context,
      translation,
    });
    res.redirect("/cards");
  } catch (err) {
    res.status(500).send("An error occurred while updating the card");
  }
});

router.post("/cards/delete/:id", async (req, res) => {
  try {
    const cardId = req.params.id;
    await Card.findByIdAndDelete(cardId);
    res.redirect("/cards");
  } catch (err) {
    res.status(500).send("An error occurred while deleting the card");
  }
});

export default router;
