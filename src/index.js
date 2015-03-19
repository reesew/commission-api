var users = require("./users");
var commissions = require("./commissions");
var permissions = require("./permissions");
var quotas = require("./quotas");
var contracts = require("./contracts");
var tiers = require("./tiers");
var express = require("express");
var app = express();

//function send(object, response) {
//    response.send(JSON.stringify(object));
//}

console.log("setting cors route");
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Content-Type", "application/json");
    next();
});

app.get('/users', function(request, response, next) {
    console.log("got request to /users");
    users.findAll(function(results) {
        response.json(results);
    });
});

app.get('/activeUsers', function(request, response, next) {
    console.log("got request to /activeUsers");
    users.findAllActive(function(results) {
        response.json(results);
    });
});

app.get('/quotas', function(request, response, next) {
    console.log("got request to /quotas");
    quotas.findAll(function(results) {
        response.json(results);
    });
});

app.get('/quotas/:userId/:year', function(request, response, next) {
    console.log("got request to /quotas");
    quotas.find(request.params.userId, request.params.year, function(results) {
        response.json(results);
    });
});

app.get('/permissions', function(request, response, next) {
    console.log("got request to /permissions");
    permissions.findAll(function(results) {
        response.json(results);
    });
});

app.get('/permissions/:userName', function(request, response, next) {
    console.log("got request to /permissions/:userName");
    permissions.find(request.params.userName, function(results) {
        response.json(results);
    });
});

app.get('/users/:id', function(request, response, next) {
    console.log("got request to /users/:id");
    users.find(request.params.id, function(results) {
        response.json(results);
    });
});

app.get('/tiers', function(request, response, next) {
    console.log("got request to /tiers");
    tiers.findAll(function(results) {
        response.json(results);
    });
});

app.get('/tiers/:userId', function(request, response, next) {
    console.log("got request to /tiers/:userId");
    tiers.find(request.params.userId, function(results) {
        response.json(results);
    });
});

app.get('/contracts', function(request, response, next) {
    console.log("got request to /contracts");
    contracts.findAll(function(results) {
        response.json(results);
    });
});

app.get('/contracts/:userId', function(request, response, next) {
    console.log("got request to /contracts/:userId");
    contracts.find(request.params.userId, function(results) {
        response.json(results);
    });
});


app.get('/commissions/:userId/:startDate/:endDate', function(request, response, next) {
    console.log("got request to /commissions/:userId");
    commissions.find(
        request.params.userId,
        request.params.startDate,
        request.params.endDate,
        function(results) {
            console.log("sending commission results");
            response.json(results);
            console.log("sent");
        }
    );
});

var server = app.listen(80, function() {
});
