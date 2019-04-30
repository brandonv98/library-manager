var express = require('express');
var router = express.Router();
const Book = require("../models").Book;



/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
    res.render("articles/index", {books: books, title: "My Awesome library" });
    // console.log(books);
  }).catch(function(error){
      res.status().send(500, error);
   });
});

// console.log(Book);

/* POST create article. # - 3 */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" ); //+ book.id);
  });
;});


/* Create a new article form. */
router.get('/new', function(req, res, next) {
  res.render("articles/new", {book: Book.build(), title: "New Book"});
});

/* Edit article form. */
router.get("/:id/edit", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render("articles/edit", {book: book, title: "Edit book"});      
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* Delete book form. */
router.get("/:id/delete", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){  
    console.log(book);
    if(book) {
      res.render("articles/delete", {book: book, title: "Delete Book"});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* GET individual book. */
router.get("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    console.log(book.id);
    if(book) {
      res.render("articles/show", {book: book, title: book.title});  
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* PUT update book. */
router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(book){
    res.redirect("/books/" + book.id);        
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;
        res.render("articles/edit", {book: book, errors: error.errors, title: "Edit Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* DELETE individual books. */
router.delete("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){  
    if(book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/books");    
  }).catch(function(error){
      res.send(500, error);
   });
});



module.exports = router;