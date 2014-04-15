var db = require('../config/db');

var projectSchema = new db.Schema({
  projectName: String,
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  createdBy: String,
  createdByName: String,
  tasks: String
});

projectSchema.statics.findByUserId = function(userId, callback) {
  this.find(
    { createdBy: userId },
    '_id projectName',
    { sort: 'modifiedOn' },
    callback);
};

module.exports = {
  
  model: db.mongoose.model('Project', projectSchema)

};
