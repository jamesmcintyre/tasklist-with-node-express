'use strict';


const PORT = 4000;



//bring in dependancies
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();


//configure general middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


//route definitions
app.get('/', function(req, res, next){
    fs.readFile('./index.html', function(err, data){
        var html = data.toString();
        res.send(html);
    })
});


app.get('/tasks', function(req, res) {
  fs.readFile('./data.json', function(err, data) {
    if(err) {
      console.log('error on read of data.jason')
      return res.status(400).send('someting wenn wrong mr');
    }
    var arr = JSON.parse(data);
    console.log('result of data.json read' + arr);
    res.send(arr);
  });
});

app.post('/task', function(req, res) {
  fs.readFile('./data.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = (JSON.parse(data) || []);
    var newTask = {
      taskname: req.body.taskname,
      duedate: req.body.duedate,
      status: false
    }
    arr.push(newTask);
    fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send('new task written!');
    });
  });
});


app.post('/task/done', function(req, res) {
  fs.readFile('./data.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = (JSON.parse(data) || []);
    arr[req.body.changestatus].status = true;
    fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send('task set to done!');
    });
  });
});


app.post('/task/delete', function(req, res) {
  fs.readFile('./data.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = (JSON.parse(data) || []);
    arr.splice(req.body.delete, 1);
    fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send('task obliterated at server!');
    });
  });
});

//spin up server
app.listen(PORT, function(){
    console.log('Express Server Listening on port ', PORT)
});
