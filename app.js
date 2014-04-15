
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var project = require('./routes/project');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.sessionSecret = "Super secret do not tell anyone";
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: app.sessionSecret,
  key: 'express.sid'
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// User routes
app.get('/user', user.index);         // current user profile
app.get('/user/new', user.create);    // create new user form
app.post('/user/new', user.doCreate); // create new user action
app.get('/user/edit', user.edit);     // edit current user form
app.post('/user/edit', user.doEdit);  // edit current user action
//app.get('/user/delete', user.confirmDelete); // delete form
//app.post('/user/delete', user.doDelete);     // delete action
app.get('/login', user.login);
app.post('/login', user.doLogin);
app.get('/logout', user.doLogout);

// Project routes
app.get('/project/new', project.create);
app.post('/project/new', project.doCreate);
app.get('/project/:id', project.displayInfo);
app.get('/project/byuser/:userId', project.byUser);
app.get('/project/edit/:id', project.edit);
app.post('/project/edit/:id', project.doEdit);
//app.get('/project/delete/:id', project.confirmDelete);
//app.post('/project/delete/:id', project.doDelete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
