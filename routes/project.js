var Project = require('../models/Project');

// GET /project/new
exports.create = function(req, res) {
  if (req.session.loggedIn === true) {
    res.render('project/form', {
      title: 'Create project',
      userId: req.session.user._id,
      userName: req.session.user.name,
      buttonText: 'Go!'
    });
  } else {
    res.redirect('/login');
  }
};

// POST /project/new
exports.doCreate = function(req, res) {
  Project.model.create({
    projectName: req.body.projectName,
    createdBy: req.body.userId,
    createdOn: Date.now(),
    tasks: req.body.tasks
  }, function(err, project) {
    if (err) {
      console.log(err);
      res.redirect('/?error=project');
    } else {
      console.log("Project created and saved: " + project);
      console.log("project._id = " + project._id);
      res.redirect('/project/' + project._id);
    }
  });
};

// GET /project/byuser/:userId
exports.byUser = function(req, res) {
  console.log("Getting user projects");
  if (req.params.userId) {
    Project.model.findByUserId(
      req.params.userId,
      function(err, projects) {
        if (!err) {
          console.log(projects);
          res.json(projects);
        } else {
          console.log(err);
          res.json({"status": "error", "error": "Error finding projects"});
        }
      }
    );
  } else {
    console.log("No user id supplied");
    res.json({"status": "error", "error": "No usre id supplied"});
  }
};

// GET /project/:id
exports.displayInfo = function(req, res) {
  console.log("Finding project _id: " + req.params.id);
  if (req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    if (req.params.id) {
      Project.model.findById(req.params.id, function(err, project) {
        if (err) {
          console.log(err);
          res.redirect('/user?404=project');
        } else {
          console.log(project);
          res.render('project/page', {
            title: project.projectName,
            projectName: project.projectName,
            tasks: project.tasks,
            createdBy: project.createdBy,
            projectId: req.params.id
          });
        }
      });
    } else {
      res.redirect('/user');
    }
  }
}
