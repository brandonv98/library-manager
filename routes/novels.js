var express = require('express');
var router = express.Router();
const Novel = require("../models").Novel;
// const page = 'novels'; TODO: Use for more dynamic rendering of pages.
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET novels listing. */
router.get('/', (req, res, next) => {
  Novel
    .findAll({
    order: [
      ["year", "DESC"]
    ]
  })
    .then((novels) => {
      res.render("novels/index", {
        novels: novels,
        title: "Library Manager"
      });
    })
    .catch(function (error) {
      res
        .status()
        .send(500, error);
    });
});

// Search threw novels
router.get('/term/:search', (req, res) => {
  let {term} = req.query;
  // make lowercase
  term = term.toLowerCase();

  Novel.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${term}%`
          }
        }, {
          author: {
            [Op.like]: `%${term}%`
          }
        }, {
          genre: {
            [Op.like]: `%${term}%`
            }
          }, {
            year: {
              [Op.like]: `%${term}%`
              }
            }
        ]
    }
    })
    .then(novels => res.render('novels', {
    novels,
    title: 'Search resaults for - ' + term
  }))
    .catch(err => console.log(err));
});

/* POST create new novel / book. # - 3 */
router.post('/', (req, res, next) => {
  let {title, author, body, genre, year} = req.body;
  let errors = [];

  if(!title) {
    errors.push({message: 'Please add a title.'});
  }
  if(!author) {
    errors.push({message: 'Please add a author.'});
  }
  if(!genre) {
    errors.push({message: 'Please add a genre.'});
  }
  if(!year) {
    errors.push({message: 'Please add a year.'});
  }

  if(errors.length > 0) {
    console.error(errors);
    res.render("novels/new", {
      novel: Novel.build(),
      title: "Create New Novel",
      errors: errors,
    });
  } else {
    Novel
    .create(req.body)
    .then((novel) => {
      res.redirect("/novels/" + novel.id);
    });  
  }
});

/* Create a new novel form. */
router.get('/new', (req, res, next) => {
  res.render("novels/new", {
    novel: Novel.build(),
    title: "Create New Novel"
  });
});

/* Edit novel form. */
router.get("/:id/edit", (req, res, next) => {
  Novel
    .findByPk(req.params.id)
    .then((novel) => {
      if (novel) {
        res.render("novels/edit", {
          novel: novel,
          title: "Edit Novel"
        });
      } else {
        res.send(404);
      }
    })
    .catch((error) => {
      res.send(500, error);
    });
});

/* Delete novel form. */
router.get("/:id/delete", (req, res, next) => {
  Novel
    .findByPk(req.params.id)
    .then((novel) => {
      if (novel) {
        res.render("novels/delete", {
          novel: novel,
          title: "Delete Novel"
        });
      } else {
        res.send(404);
      }
    })
    .catch((error) => {
      res.send(500, error);
    });
});

/* GET individual novel. */
router.get("/:id", (req, res, next) => {
  Novel
    .findByPk(req.params.id)
    .then((novel) => {
      if (novel) {
        res.render("novels/show", {
          novel: novel,
          title: novel.title
        });
      } else {
        res.send(404, error);
        console.log('ERROR');
      }
    })
    .catch((error) => {
      // If ID = Not Found throw error.
      res.render('error', {
        message: "Oops a error occured - the book ID is Not Found!",
        error: {
          status: "Status: 404",
          stack: "Can not find - " + req.params.id
        },
        bookNotFound: true
      });
    });
});

/* PUT update novel. */
router.put("/:id", (req, res, next) => {
  Novel
    .findByPk(req.params.id)
    .then((novel) => {
      if (novel) {
        return novel.update(req.body);
      } else {
        res.send(404);
      }
    })
    .then((novel) => {
      res.redirect(`/novels/` + novel.id);
    })
    .catch((error) => {
      if (error.name === "SequelizeValidationError") {
        var novel = Book.build(req.body);
        novel.id = req.params.id;
        res.render("novels/edit", {
          novel: novel,
          errors: error.errors,
          title: "Edit Novel"
        })
      } else {
        throw error;
      }
    })
    .catch((error) => {
      res.send(500, error);
    });
});

/* DELETE individual novels. */
router.delete("/:id", (req, res, next) => {
  Novel
    .findByPk(req.params.id)
    .then((novel) => {
      if (novel) {
        return novel.destroy();
      } else {
        res.send(404);
      }
    })
    .then(() => {
      res.redirect("/novels");
    })
    .catch((error) => {
      res.send(500, error);
    });
});

module.exports = router;