import mongoose from "mongoose";

const deckSchema = new mongoose.Schema({
  deckNo: {
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
