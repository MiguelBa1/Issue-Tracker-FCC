'use strict';
require('../connection')
const projectSchema = require('../models/projects')
const { model } = require('mongoose')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let projectName = req.params.project;
      let Project = model(projectName, projectSchema)
      Project.find(req.query, function(err, issues) {
        if (err) throw err
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
      issue.save(function(err) {
        if (err) {
          res.json({ error: 'required field(s) missing' })
          return
        }
        res.send(issue)
      })
    })
    
    .put(function (req, res){
      if (!req.body.hasOwnProperty('_id')) {
        res.json({ error: 'missing _id' })
        return
      }
      //console.log(Object.keys(req.body), Object.keys(req.body).length)
      if (Object.keys(req.body).length != 6){
        res.json({ error: 'no update field(s) sent', '_id': req.body._id })
        return
      }

      let projectName = req.params.project;
      let Project = model(projectName, projectSchema)

      Project.findOneAndUpdate({_id: req.body._id}, {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        updated_on: new Date()
      }, function(err, issue) {
        if (!issue) {
          res.send({ error: 'could not update', '_id': req.body._id })
          return
        }
        res.send({  result: 'successfully updated', '_id': issue._id })
      })
      
    })
    
    .delete(function (req, res){
      if (!req.body.hasOwnProperty('_id')) {
        res.json({ error: 'missing _id' })
        return
      }
      let projectName = req.params.project;
      let Project = model(projectName, projectSchema)
      Project.findByIdAndRemove(req.body._id, (err, issue) => {
        if (!issue) {
          res.json({ error: 'could not delete', '_id': req.body._id })
          return
        }
        res.json({ result: 'successfully deleted', '_id': req.body._id })
      })
    });
    
};
