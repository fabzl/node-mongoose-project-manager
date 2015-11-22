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

  model: db.mongoose.model('User', userSchema),

  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },

  validPassword: function(formPassword, dbPassword) {
    return bcrypt.compareSync(formPassword, dbPassword);
  }

  // getUsers: function () { 
  //   return db.getCollection('users').find({});
  // }

}
