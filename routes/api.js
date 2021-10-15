'use strict';
require('../connection')
const projectSchema = require('../models/projects')
const { model } = require('mongoose')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let projectName = req.params.project;
      let Project = model(projectName, projectSchema)
      Project.find({}, function(err, issues) {
        if (err) throw err
        //console.log(issues)
        res.json(issues)
      })
    })
    
    .post(async function (req, res){
      let projectName = req.params.project;
      let Project = model(projectName, projectSchema)
      let issue = new Project({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        assigned_to: req.body.assigned_to,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      })
      issue = await issue.save(function(err) {
        if (err) res.json({ error: 'required field(s) missing' })
      })
      //console.log(issue)
      res.send(issue)
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
