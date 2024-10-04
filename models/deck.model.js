import mongoose from "mongoose";

const deckSchema = new mongoose.Schema({
  deckId: {
    type: Number,
    required: true,
    unique: true,
  },
  reviewInterval: {
    type: Number,
    required: true,
  },
  nextReviewDate: {
    type: Date,
    required: true,
  },
});

const Deck = mongoose.model("Deck", deckSchema);

export default Deck;
