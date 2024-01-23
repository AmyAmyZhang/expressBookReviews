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
  const getBooksPromise = new Promise((resolve, reject) => {
    resolve(books); // Resolve the promise with the books array
    // In a real-world scenario, you would perform the actual asynchronous operation here
  });
  // Use the promise
  getBooksPromise
  .then((result) => {
    // Send the result when the promise is resolved
    res.send(result);
  })
  .catch((error) => {
    // Handle errors if the promise is rejected
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Wrap the asynchronous operation in a promise
  const getBookDetailsPromise = new Promise((resolve, reject) => {
    const selectedBook = books[isbn];
    if (selectedBook) {
      resolve(selectedBook); // Resolve the promise with the selected book details
    } else {
      reject(new Error('Unable to find the book!')); // Reject the promise with an error message
    }
  });

  // Use the promise
  getBookDetailsPromise
    .then((result) => {
      // Send the result when the promise is resolved
      res.send(result);
    })
    .catch((error) => {
      // Handle errors if the promise is rejected
      console.error('Error:', error.message);
      res.status(404).send('Not Found'); // Sending a 404 status for book not found
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  // Wrap the asynchronous operation in a promise
  const getBookDetailsPromise = new Promise((resolve, reject) => {
    const bookIds = Object.keys(books);
    const matchingBooks = [];
    bookIds.forEach(bookId => {
      const book = books[bookId];
      if (book.author === requestedAuthor) {
        matchingBooks.push(book);
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks); // Resolve the promise with the selected book details
    } else {
      reject(new Error('Unable to find the book!')); // Reject the promise with an error message
    }
  });

  // Use the promise
  getBookDetailsPromise
    .then((result) => {
      // Send the result when the promise is resolved
      res.send(result);
    })
    .catch((error) => {
      // Handle errors if the promise is rejected
      console.error('Error:', error.message);
      res.status(404).send('Not Found'); // Sending a 404 status for book not found
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title;

   // Wrap the asynchronous operation in a promise
   const getBookDetailsPromise = new Promise((resolve, reject) => {
    const bookIds = Object.keys(books);
    const matchingBooks = [];
    bookIds.forEach(bookId => {
      const book = books[bookId];
      if (book.title === requestedTitle) {
        matchingBooks.push(book);
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks); // Resolve the promise with the selected book details
    } else {
      reject(new Error('Unable to find the book!')); // Reject the promise with an error message
    }
  });

  // Use the promise
  getBookDetailsPromise
    .then((result) => {
      // Send the result when the promise is resolved
      res.send(result);
    })
    .catch((error) => {
      // Handle errors if the promise is rejected
      console.error('Error:', error.message);
      res.status(404).send('Not Found'); // Sending a 404 status for book not found
    });
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
