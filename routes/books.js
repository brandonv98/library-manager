const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))

/* GET books listing. */
router.get('/', (req, res, next) => {
  Book.findAll({
    order: [["title", "ASC"]]
  })
  .then( books => res.render('index', { title: 'All Books', books }) )
});

router.post('/search', (req, res, next) => {
  Book.findAll({
    where: {
      [Op.or]: [
        { title:  { [Op.like]: `%${req.body.search}%` }},
        { author: { [Op.like]: `%${req.body.search}%` }},
        { genre:  { [Op.like]: `%${req.body.search}%` }}
      ]
    }
  })
  .then( books => res.render('index',  { title: 'Search Results', books }) );
})

/* GET new books form listing. */
router.get('/new', (req, res, next) => res.render('new-book',  { title: 'New Book', book: Book.build() }) );

/* POST CREATE new books by id. */
router.post('/new', (req, res, next) => {
  Book.create(req.body)
    .then( () => res.redirect(`/books`))
    .catch(err =>{
      if(err.name === "SequelizeValidationError"){
        res.render('new-book',  {
          title: 'New Book',
          book: Book.build(req.body),
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(error => res.sendStatus(500, error));
});

/* GET READ books by id. */
router.get('/:id', (req, res, next) => {
  Book.findById(req.params.id).then( book =>{ 
    book ? res.render('update-book',  { title: 'Update Book', book }) : (
      error = new Error('Page Not Found'),
      error.status=404,
      res.render('error',{error, title: `${error.status}-${error.message}`})
    );
  })
  .catch(error => res.sendStatus(500, error));
});

/* POST UPDATE books by id. */
router.post('/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then( book => book.update(req.body) )
  .then( () => res.redirect('/books') )
  .catch(error => res.sendStatus(500, error));
});

/* POST DELETE books by id. */
router.post('/:id/delete', (req, res, next) =>{
  Book.findById(req.params.id)
  .then( book => book.destroy() )
  .then( () => res.redirect('/books') );
});

module.exports = router;
