import moment from "moment";
import Deck from "../models/deck.model.js";
import { getUnreviewedCardsByDeckNo } from "./card.controller.js";
import Card from "../models/card.model.js";

export const createDecks = async () => {
  const existingDecks = await Deck.find({});

  if (existingDecks.length > 0) {
    return;
  }

  const decks = [
    { deckNo: 1, reviewInterval: 1 },
    { deckNo: 2, reviewInterval: 2 },
    { deckNo: 3, reviewInterval: 5 },
    { deckNo: 4, reviewInterval: 8 },
    { deckNo: 5, reviewInterval: 14 },
  ];

  const now = moment();
  for (const deck of decks) {
    const nextReviewDate = now.clone().add(deck.reviewInterval, "days").toDate();

    const newDeck = new Deck({
      deckNo: deck.deckNo,
      reviewInterval: deck.reviewInterval,
      nextReviewDate,
    });

    try {
      await newDeck.save();
      console.log(`Deck ${deck.deckNo} ++`);
    } catch (err) {
      console.error(`Deck ${deck.deckNo} --`, err);
    }
  }
};

export const showDeckByNo = async (req, res) => {
  try {
    const deckNo = req.params.no;
    const deck = await Deck.findOne({ deckNo: deckNo });

    const cards = await getUnreviewedCardsByDeckNo(deckNo);

    res.render("deck", { deckId: deck._id, deckNo, cards });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the deck");
  }
};

export const updateDeck = async (req, res) => {
  try {
    const deckId = req.params.id;

    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    await Card.updateMany({ deckNo: deck.deckNo }, { reviewed: false });

    const now = moment();
    const nextReview = now.add(deck.reviewInterval, "days");
    deck.nextReviewDate = nextReview.toDate();
    await deck.save();

    res.json({ message: "Next review date updated", nextReviewDate: deck.nextReviewDate });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating next review date");
  }
};
