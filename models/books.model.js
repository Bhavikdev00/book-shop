const mongoose = require("mongoose");

const BooksScema = mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },

    price: {
      type: String,
    },
    publication_date: {
      type: Date,
    },
    pages: {
      type: String,
    },
    language: {
      type: String,
    },
    rating: {
      type: String,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cateory",
    },
    publisher: {
      type: String,
    },
    ISBN: {
      type: String,
    },
    cover_image_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BooksScema);
module.exports = Book;
