const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(404).json({ message: "User exists already" });
  } else {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered!" });
  }
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  getAllBooks()
    .then((allBooks) => {
      return res.status(200).send(JSON.stringify(allBooks, null, 4));
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const targetISBN = parseInt(req.params.isbn);
  new Promise((resolve, reject) => {
    resolve(books[targetISBN]);
  })
    .then((targetBook) => {
      if (!targetBook) {
        return res.status(404).json({ message: "ISBN not found" });
      } else {
        return res.status(200).json(targetBook);
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(
      Object.values(books).filter(
        (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
      )
    );
  })
    .then((matchingBooks) => {
      if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks));
      } else {
        return res.status(404).json({ message: "No books by that author" });
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(
      Object.values(books).filter(
        (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
      )
    );
  })
    .then((matchingBooks) => {
      if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks));
      } else {
        return res.status(404).json({ message: "No books by that title" });
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = parseInt(req.params.isbn);
  new Promise((resolve, reject) => {
    resolve(books[targetISBN]);
  })
    .then((targetBook) => {
      if (!targetBook) {
        return res.status(404).json({ message: "ISBN not found" });
      } else {
        return res.status(200).json(targetBook.reviews);
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

module.exports.general = public_users;
