var express = require('express');
var router = express.Router();
const Novel = require("../models").Novel;
const page = 'novels';


/* GET novels listing. */
router.get('/', function(req, res, next) {
  Novel.findAll({order: [["createdAt", "DESC"]]}).then(function(novels){
    res.render("novels/index", {novels: novels, title: "My library" });
    // console.log(novels);
  }).catch(function(error){
      res.status().send(500, error);
   });
});

// console.log(Book);

/* POST create article. # - 3 */
router.post('/', function(req, res, next) {
  Novel.create(req.body).then(function(novel) {
    res.redirect("/novels/" ); //+ novel.id);
  });
;});


/* Create a new article form. */
router.get('/new', function(req, res, next) {
  res.render("novels/new", {novel: Novel.build(), title: "New Book"});
});

/* Edit article form. */
router.get("/:id/edit", function(req, res, next){
  Novel.findByPk(req.params.id).then(function(novel){
    if(novel) {
      res.render("novels/edit", {novel: novel, title: "Edit novel"});      
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* Delete novel form. */
router.get("/:id/delete", function(req, res, next){
  Novel.findByPk(req.params.id).then(function(novel){  
    console.log(novel);
    if(novel) {
      res.render("novels/delete", {novel: novel, title: "Delete Book"});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* GET individual novel. */
router.get("/:id", function(req, res, next){
  Novel.findByPk(req.params.id).then(function(novel){
    console.log(novel.id);
    if(novel) {
      res.render("novels/show", {novel: novel, title: novel.title});  
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* PUT update novel. */
router.put("/:id", function(req, res, next){
  Novel.findByPk(req.params.id).then(function(novel){
    if(novel) {
      return novel.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(novel){
    res.redirect(`/novels/` + novel.id);        
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var novel = Book.build(req.body);
        novel.id = req.params.id;
        res.render("novels/edit", {novel: novel, errors: error.errors, title: "Edit Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* DELETE individual novels. */
router.delete("/:id", function(req, res, next){
  Novel.findByPk(req.params.id).then(function(novel){  
    if(novel) {
      return novel.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/novels");    
  }).catch(function(error){
      res.send(500, error);
   });
});



module.exports = router;