import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  word_type: {
    type: String,
    required: true,
  },
  context: {
    type: String,
  },
  translation: {
    type: String,
    required: true,
  },
  deckNo: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
