var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var id = require('mongodb').ObjectID;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;


var uri = "mongodb://localhost:27017/imdb";

/* GET home page. */
router.get('/', function(req, res, next) {
  mongoClient.connect(uri, function(err, db){
    var collection = db.collection('movies');
    collection.find({}).toArray(function(err,docs){
      if(err)throw err;
      console.log("GET / " + docs);
      res.render('index2',{ docs: docs});
    });
  });
});

router.post('/newEntry', function(req,res){
  mongoClient.connect(uri, function(err, db){
    if(err)throw err;
    var collection = db.collection('movies');
    collection.insertOne({
      'title': req.body.title,
      'year': req.body.year,
      'imdb': req.body.imdb
    }, function(err, results){
      console.log(results);
    })
  });
  res.redirect("/");
});

router.get('/edit/:id', function(req,res){
  //console.log(req);
  console.log(req.path);
  console.log("GET ID: "+req.params.id);
  mongoClient.connect(uri, function(err,db){
    if(err)throw err;
    var collection = db.collection('movies');
    collection.findOne({'_id': new id(req.params.id)}, function(err,doc){
      if(err)throw err;
      console.log("THE DOC: " +doc);
      res.render('edit', {doc: doc});
    });
  });
});

router.put('/edit/:id', function(req,res){
  console.log("WORD IN PUT");
  mongoClient.connect(uri, function(err, db){
    if(err)throw err;
    var collection = db.collection('movies');
    collection.updateOne({
      _id: new id(req.body.id)
    },{
      $set: {
        title: req.body.title,
        year: req.body.year,
        imdb: req.body.imdb
      }
    }, function(err,results){
      if(err)throw err;
      //console.log(results);
    })
  })
  res.redirect("/");
  //res.json(req.body);
});

router.delete('/delete/:id', function(req,res){
  console.log("IN DELETE");
  mongoClient.connect(uri, function(err,db){
    if(err)throw err;
    var collection = db.collection('movies');
    collection.deleteOne({'_id': new id(req.params.id)}, function(err, results){
      if(err)throw err;
      console.log(results.result);
      res.redirect("/");
    });
  });
});

router.get('/delete/:id', function(req, res){
  mongoClient.connect(uri, function(err,db){
    if(err)throw err;
    var collection = db.collection('movies');
    collection.findOne({'_id': new id(req.params.id)}, function(err,doc){
      if(err)throw err;
      res.render('delete', {doc: doc});
    });
  });
});

router.get('/newEntry', function(req,res){
  res.render('new_entry');
});

router.get('/login', function(req,res){
  res.render(login);
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/login'}));

module.exports = router;