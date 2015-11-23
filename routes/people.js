var Users = require('../models/User');


exports.team = function(req, res){

	users = Users.getUsers(req.body.Name);  
  //res.render('people', { title: 'People Page' });
 	console.log("team :",users);
};