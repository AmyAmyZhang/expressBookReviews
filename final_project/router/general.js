const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username && password) {
    return res.status(400).json({ message: 'Password is required for registration' });
  }
  if (username && !password) {
    return res.status(400).json({ message: 'Username is required for registration' });
  }

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  return res.status(404).json({message: "Unable to register user."});

  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const selectedBook = books[isbn];
  if (selectedBook) {
      res.send(selectedBook);
  } else {
      res.send('Unable to find the book!');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  const bookIds = Object.keys(books);
  const matchingBooks = [];
  bookIds.forEach(bookId => {
    const book = books[bookId];
    if (book.author === requestedAuthor) {
      matchingBooks.push(book);
    }
  });
  res.send(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title;
  const bookIds = Object.keys(books);
  const matchingBooks = [];
  bookIds.forEach(bookId => {
    const book = books[bookId];
    if (book.title === requestedTitle) {
      matchingBooks.push(book);
    }
  });
  res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const selectedBook = books[isbn];
  if (selectedBook) {
      res.send(selectedBook.reviews);
  } else {
      res.send('Unable to find the book!');
  }
});

module.exports.general = public_users;
