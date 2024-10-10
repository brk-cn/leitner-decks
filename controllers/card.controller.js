import Card from "../models/card.model.js";

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ deleted: false });
    res.render("cards", { cards });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the cards");
  }
};

export const showAddCardPage = (req, res) => {
  res.render("add-card");
};

export const addNewCard = async (req, res) => {
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
};

export const showEditCardPage = async (req, res) => {
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
};

export const editCard = async (req, res) => {
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
};

export const deleteCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    // await Card.findByIdAndDelete(cardId);
    await Card.findByIdAndUpdate(cardId, { deleted: true });
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the card");
  }
};

export const updateCard = async (req, res) => {
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
      card.reviewed = true;
    }

    await card.save();
    res.json({ message: "DeckNo updated", deckNo: card.deckNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating deckNo" });
  }
};

export const getUnreviewedCardsByDeckNo = async (deckNo) => {
  try {
    let cards = await Card.find({ deckNo: deckNo, reviewed: false, deleted: false });
    if (!cards.length) {
      return null;
    }
    cards = cards.sort(() => Math.random() - 0.5);

    return cards;
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the cards");
  }
};
