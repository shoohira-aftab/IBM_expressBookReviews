const express = require('express');
let books = require("./booksdb.js");
//let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Function to fetch the book list (promisified)
function fetchBookList() {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation (e.g., fetching data from a database)
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulated delay of 1 second
  });
}

// Get the book list available in the shop
public_users.get('/',async (req, res)=> {
  try {
    const bookList = await fetchBookList();
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
   res.send(matchingBooks);
 

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
 });

module.exports.general = public_users;
