var User = require('../models/User');
var Project = require('../models/Project');

/* CREATE */
// GET /user/new
exports.create = function(req, res) {
  res.render('user/form', {
    title: 'Create User',
    name: "",
    email: "",
    buttonText: "Join!"
  });
};

// POST /user/new
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

/* READ */
// GET /user
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
            User.model.update(
              { _id: user._id },
              { $set: {lastLogin: Date.now()} },
              function() {
                res.redirect('/user');
              }
            );
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

/* UPDATE */
// GET /user/edit
exports.edit = function(req, res) {
  if (req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    res.render('user/form', {
      title: 'Edit profile',
      _id: req.session._id,
      name: req.session.user.name,
      email: req.session.user.email,
      buttonText: "Save"
    });
  }
};

// POST /user/edit
exports.doEdit = function(req, res) {
  if (req.session.user._id) {
    User.model.findById(
      req.session.user._id,
      function(err, user) {
        if (err) {
          console.log(err);
          res.redirect('/user?error=finding');
        } else {
          user.name = req.body.FullName;
          user.email = req.body.Email;
          user.modifiedOn = Date.now();
          user.save(function(err) {
            if (!err) {
              console.log('User updated: ' + req.body.FullName);
              req.session.user.name = req.body.FullName;
              req.session.user.email = req.body.Email;
              res.redirect('/user');
            }
          });
        }
      }
    );
  }
};

/* DELETE */
// GET /user/delete
exports.confirmDelete = function(req, res) {
  res.render('user/delete', {
    title: 'Delete account',
    _id: req.session.user._id,
    name: req.session.user.name,
    email: req.session.user.email
  });
};

// POST /user/delete
exports.doDelete = function(req, res) {
  if (req.body._id) {
    User.model.findByIdAndRemove(
      req.body._id,
      function(err, user) {
        if (err) {
          console.log(err);
          return res.redirect('/user?error=deleting');
        }
        console.log("User deleted:", user);
        Project.model.remove({ createdBy: req.body._id }, function(err) {
          if (!err) {
            console.log("All projects created by " + req.body._id + " have been deleted.")
          } else {
            console.log(err);
          }
        });
        clearSession(req.session, function() {
          res.redirect('/');
        });
      }
    );
  }
};

// GET /logout
exports.doLogout = function(req, res) {
  if (req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    console.log("Logout request");
    req.session.destroy();
    res.redirect('/');
  }
}

// Helpers
var clearSession = function(session, callback) {
  session.destroy();
  callback();
};
