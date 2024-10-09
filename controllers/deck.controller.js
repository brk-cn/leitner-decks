import moment from "moment";
import Deck from "../models/deck.model.js";

export const createDecks = async (startDate) => {
  const start = moment(startDate).startOf("day");

  const decks = [
    { deckNo: 1, reviewInterval: 1 },
    { deckNo: 2, reviewInterval: 2 },
    { deckNo: 3, reviewInterval: 5 },
    { deckNo: 4, reviewInterval: 8 },
    { deckNo: 5, reviewInterval: 14 },
  ];

  for (const deck of decks) {
    const nextReviewDate = start.clone().add(deck.reviewInterval, "days").toDate();

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
