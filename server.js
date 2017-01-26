/*jshint node:true*/
'use strict';
var express = require('express');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var Log = require('./schemas/logSchema');

var port = 9002;

// Enable CORS
app.options('*', cors());
app.use(cors());

// parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Log info from every request
app.use(function (req, res, next) {
    res.on('finish', function () {
        var logEntry = {
            'url': req.url,
            'date': new Date().getTime(),
            'path': req.route.path,
            'method': req.method
        };
        Log.create(logEntry);
    });
    next();
});

// require endpoints
app.use('/', require('./endpoints/auth.js'));
app.use('/', require('./endpoints/users.js'));

var DBSTRING;
// Check environment, and use the appropriate database
if (process.env.NODE_ENV === 'test') {
    console.log('Going to use the test database...');
    DBSTRING = 'mongodb://localhost/testDB';
} else {
    DBSTRING = 'mongodb://localhost/tefl';
}
app.listen(port, function () {
        console.log('Server is running on localhost:' + port);
        console.log('ertyu');
        require('./googlesheet/googlesheet.js')();
        console.log('esrtfyguhj');
    });


module.exports = app;