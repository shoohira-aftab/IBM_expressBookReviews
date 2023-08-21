const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid=false;
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
  }
 
  return res.status(200).send("User successfully logged in");
  } else {
   
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
     const { ISBN, review } = req.query;
    const username = req.session.username;
  
   /* if (!username) {
      return res.status(401).json({ message: 'Authentication required' });
    }*/
  
    if (!ISBN || !review) {
      return res.status(400).json({ message: 'ISBN and review parameters are required' });
    }
  
    // Check if the book with the given ISBN exists
    const book = books[ISBN];
  
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Check if the user has already posted a review for this book
    if (book.reviews[username]) {
      // If the same user posts a different review, modify the existing review
      book.reviews[username] = review;
      return res.json({ message: 'Review modified successfully' });
    } else {
      // If another user posts a review, add it under the same ISBN
      book.reviews[username] = review;
      return res.json({ message: 'Review added successfully' });
    }
  });
  

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.username;
  
    /*if (!username) {
      return res.status(401).json({ message: 'Authentication required' });
    }*/
  
    // Check if the book with the given ISBN exists
    const book = books[ISBN];
  
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Check if the user has posted a review for this book
    if (book.reviews[username]) {
      // Delete the user's review
      delete book.reviews[username];
      return res.json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found for this user' });
    }
  });

module.exports.authenticated = regd_users;

module.exports.users = users;
