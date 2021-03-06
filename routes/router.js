
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var TowCompany = require('../models/towCompany');
var path = require('path');
var app = require('express');


// GET route for reading data
router.get('/', function (req, res, next) {
  console.log("I am here");
  return res.sendFile(path.join(__dirname + '/views/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})


// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          return res.render(path.resolve(__dirname + '/../views/Admin.ejs'),{user:user});

        }
      }
    });
});

//post add tow company details
//POST route for updating data
router.post('/addTow', function (req, res, next) {

  console.log(req.body.name);
  if (req.body.name &&
    req.body.location &&
    req.body.address &&
    req.body.contact) {

    var towData = 
       {
      name: req.body.name,
      location: req.body.location,
      address: req.body.address,
      contact: req.body.contact,
    };
    

    TowCompany.create(towData, function (error, towdata) {
      if (error) {
        return next(error);
      } else {
        console.log(towdata);
        return res.redirect('/addTow');
      } 
    });
  }

});

router.get('/addTow', function (req, res, next) {
  TowCompany.find({}, function(err, towdata) {
    if(err) return console.log(err);
    console.log(towdata);
    return res.render(path.resolve(__dirname + '/../views/TowingCompanyDetails.ejs'),{TowCompany:towdata});
  }) 
});

router.get('/addTow', function (req, res, next) {
  TowCompany.find({}, function(err, towdata) {
    if(err) return console.log(err);
    console.log(towdata);
    return res.render(path.resolve(__dirname + '/../views/TowingCompanyDetails.ejs'),{TowCompany:towdata});
  }) 
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});



module.exports = router;