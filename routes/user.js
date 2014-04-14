var User = require('../models/User');

exports.create = function(req, res) {
  res.render('user/form', {
    title: 'Create User',
    buttonText: "Join!"
  });
};

exports.doCreate = function(req, res) {
  if (req.body.Password === req.body.ConfirmPassword) {
    password = User.generateHash(req.body.Password);  
    User.model.create({
      name: req.body.FullName,
      password: password,
      email: req.body.Email,
      modifiedOn: Date.now(),
      lastLogin: Date.now()
    }, function(err, user) {
      if (err) {
        console.log(err);
        if(err.code === 11000) {
          res.redirect('/user/new?exists=true');
        } else {
          res.redirect('/?error=true');
        }
      } else {
        // Success
        console.log("User created and saved: " + user);
        req.session.user = {
          "name": user.name,
          "email": user.email,
          "_id": user._id
        };
        req.session.loggedIn = true;
        res.redirect('/user');
      }
    });
  } else {
    res.redirect('/user/new/?error=password');
  }
}

exports.index = function(req, res) {
  if (req.session.loggedIn === true) {
    res.render('user/profile', {
      title: req.session.user.name,
      name: req.session.user.name,
      email: req.session.user.email,
      userId: req.session.user._id
    });
  } else {
    res.redirect('/login');
  }
};

// GET /login
exports.login = function(req, res) {
  res.render('user/login', {title: 'Login'});
};

// POST /login
exports.doLogin = function(req, res) {
  if (req.body.Email) {
    User.model.findOne(
      {'email': req.body.Email},
      '_id name email password',
      function(err, user) {
        if (!err) {
          if (!user) {
            res.redirect('/login?404=user');
          } else if (!User.validPassword(req.body.Password, user.password)) {
            res.redirect('/login?404=user');
          } else {
            // Success
            req.session.user = {
              "name": user.name,
              "email": user.email,
              "_id": user._id
            };
            req.session.loggedIn = true;
            console.log('Logged in user: ' + user);
            res.redirect('/user');
          }
        } else {
          res.redirect('/login?404=error');
        }
      }
    );
  } else {
    res.redirect('/login?404=error');
  }
};
