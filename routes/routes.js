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

router.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.render("cards", { cards });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the cards");
  }
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

router.get("/cards/add", (req, res) => {
  res.render("add-card");
});

router.get("/cards/edit/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    res.render("edit-card", { card });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).send("An error occurred while updating the card");
  }
});

router.post("/cards/delete/:id", async (req, res) => {
  try {
    const cardId = req.params.id;
    await Card.findByIdAndDelete(cardId);
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the card");
  }
});

router.post("/cards/update-deckno", async (req, res) => {
  const { cardId, isCorrect } = req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (isCorrect) {
      card.deckNo += 1;
    } else {
      card.deckNo = Math.max(1, card.deckNo - 1);
    }

    await card.save();
    res.json({ message: "DeckNo updated", deckNo: card.deckNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating deckNo" });
  }
});

router.get("/decks/:id", async (req, res) => {
  try {
    const deckNo = req.params.id;
    const cards = await Card.find({ deckNo: deckNo });
    const deck = await Deck.findOne({ deckNo: deckNo });

    if (!cards.length) {
      return res.status(404).send("No cards found for this deck.");
    }

    res.render("deck", { deckId: deck._id, deckNo, cards });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the deck");
  }
});

router.post("/decks/:id/update-nextreview", async (req, res) => {
  try {
    const deckId = req.params.id;
    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    nextReview = moment().endOf("day").add(deck.interval, "days");
    deck.nextReviewDate = nextReview.toDate();

    await deck.save();

    res.json({ message: "Next review date updated", nextReviewDate: deck.nextReviewDate });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating next review date");
  }
});

export default router;
