const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST test', function() {
    test('Create an issue with every field', function() {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'test title',
          issue_text: 'test text',
          assigned_to: 'John',
          created_by: 'Doe',
          status_text: 'working'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'test title');
          assert.equal(res.body.issue_text, 'test text');
          assert.equal(res.body.assigned_to, 'John');
          assert.equal(res.body.created_by, 'Doe');
          assert.equal(res.body.status_text, 'working');
          assert.isOk(res.body.open);
        })
    })
    test('Create an issue with only required fields', function() {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'test title',
          issue_text: 'test text',
          created_by: 'Doe',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'test title');
          assert.equal(res.body.issue_text, 'test text');
          assert.equal(res.body.created_by, 'Doe');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.isOk(res.body.open);
        })
    })
    test('Create an issue with missing required fields', function() {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_text: 'test text',
          created_by: 'Doe',
          status_text: 'working'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
        })
    })
  })
  suite('GET test', function() {
    test('View issues on a project', function() {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, '/api/issues/apitest should return an array with issues');
        })
    })
    test('View issues on a project with one filter', function() {
      chai
        .request(server)
        .get('/api/issues/apitest?open=true')
        .end(function(err, res) {
          let filters = true
          res.body.map((elem) => {
            if (elem.open == false) {
              filters = false 
            }
          })
          assert.equal(res.status, 200);
          assert.isOk(filters, 'All returned elements should have open:true property');
        })
    })
    test('View issues on a project with multiple filters', function() {
      chai
        .request(server)
        .get('/api/issues/apitest?open=true&created_by=Doe')
        .end(function(err, res) {
          let filters = true
          res.body.map((elem) => {
            if (elem.open == false || elem.created_by != 'Doe') {
              filters = false 
            }
          })
          assert.equal(res.status, 200);
          assert.isOk(filters, 'All returned elements should have open:true property');
        })
    })
  })
  suite('PUT test', function() {
    test('Update one field on an issue', function() {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '61f08dc000ed5004d7e85848',
          issue_title: 'Updated title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, '61f08dc000ed5004d7e85848')
        })
    })
    test('Update multiple fields on an issue', function() {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '61f08dc000ed5004d7e85848',
          issue_title: 'Updated title',
          issue_text: 'Updated text',
          created_by: 'Updated creator'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, '61f08dc000ed5004d7e85848')
        })
    })
    test('Update an issue with missing _id', function() {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          issue_title: 'Updated title',
          issue_text: 'Updated text',
          created_by: 'Updated creator'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id')
        })
    })
    test('Update an issue with no fields to update', function() {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '61f08dc000ed5004d7e85848',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent')
          assert.equal(res.body._id, '61f08dc000ed5004d7e85848')
        })
    })
    test('Update an issue with an invalid _id', function() {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '616c589d006b3e40b524sb7k',
          issue_text: 'Updated text',
          created_by: 'Updated creator'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update')
          assert.equal(res.body._id, '616c589d006b3e40b524sb7k')
        })
    })
  })
  suite('DELETE test', function() {
    test('Delete an issue', function() {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({_id: '61f09276dd5e8baeefefd194'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, '61f09276dd5e8baeefefd194')
        })
    })
    test('Delete an issue with an invalid _id', function() {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({_id: '61f08fc832c5fc022367'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete')
          assert.equal(res.body._id, '61f08fc832c5fc022367')
        })
    })
    test('Delete an issue with missing _id', function() {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id')
        })
    })
  })
})
