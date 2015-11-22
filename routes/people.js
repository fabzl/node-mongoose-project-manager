var People = require('../models/People');


exports.team = function(req, res){

	users = People.getUsers(req.body.Name);  
  //res.render('people', { title: 'People Page' });
 	console.log("team :",users);
};