var db = require('../config/db');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new db.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  lastLogin: Date
});

module.exports = {

 // model: db.mongoose.model('User', userSchema),

  // getUsers: function () { 
  //  // return model.getCollection('users').find({});
  //  this.model.find({})
  //            .exec(function(err, data){
  //               console.log("datattatta",data);
  //             });
  //  }
}
