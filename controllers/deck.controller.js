import moment from "moment";
import Deck from "../models/deck.model.js";

export const createDecks = async (startDate) => {
  const utcStart = moment.utc(startDate).startOf("day");

  const decks = [
    { deckId: 1, reviewInterval: 1 },
    { deckId: 2, reviewInterval: 2 },
    { deckId: 3, reviewInterval: 5 },
    { deckId: 4, reviewInterval: 8 },
    { deckId: 5, reviewInterval: 14 },
  ];

  for (const deck of decks) {
    const nextReviewDate = utcStart.clone().add(deck.reviewInterval, "days").toDate();

    const newDeck = new Deck({
      deckId: deck.deckId,
      reviewInterval: deck.reviewInterval,
      nextReviewDate,
    });

    try {
      await newDeck.save();
      console.log(`Deck ${deck.deckId} ++`);
    } catch (err) {
      console.error(`Deck ${deck.deckId} --`, err);
    }
  }
};
