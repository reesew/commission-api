var mysql = require('./mysql');
//var allUsers = [];
//var activeUsers = [];

function User(id, name, disabled) {
    this.id = id;
    this.name = name;
    this.disabled = disabled;
    this.isDisabled = function() {
        return this.disabled === 1;
    }
    this.getName = function() {
        return this.name;
    }
    this.getId = function() {
        return this.id;
    }
};

function findAll(callback) {
    //if (allUsers.length !== 0) {
    //    return callback(allUsers);
    //}
    var queryText = "select SalespersonNo, SalespersonName, disabled from users where salespersondivisionNo = '00'";
    console.log("finding all users");
    var params = [];
    mysql.query(queryText,
        function(results) {
            var userArray = resultsToUsers(results);
            //allUsers = userArray;
            return callback(userArray);
        },
        params
    );
}

function findAllActive(callback) {
    //if (activeUsers.length !== 0) {
    //    return callback(activeUsers);
    //}
    var queryText = "select SalespersonNo, salespersonName, disabled from users where salespersondivisionNo = '00' and not disabled = 1 ";
    console.log("finding all users");
    var params = [];
    mysql.query(queryText,
        function(results) {
            var userArray = resultsToUsers(results);
            //activeUsers = userArray;
            return callback(userArray);
        },
        params
    );
}

//function getName(userId, callback) {
//    if (userId.indexOf('|') !== -1 || userId === "ALL") {
//        return getNames(userId, callback);
//    }
//    findAll(function(users) {
//        for (var i = 0; i < users.length; i++) {
//            if (users[i].getId() == userId) {
//                return callback(users[i].getName());
//            }
//        }
//    });
//}
//
//function getNames(userIds, callback) {
//    if (userIds === "ALL") {
//        return callback("All");
//    } else {
//        return callback("Group:" + userIds);
//    }
//}

function find(userId, callback) {
    var params = [userId];
    var queryText = "select SalespersonNo, salespersonName, disabled from users where SalespersonNo = ? and salespersondivisionNo = '00'";
    console.log("finding user");
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToUsers(results));
        },
        params
    );
}

function resultsToUsers(results) {
    var users = [];
    var user;
    for (var i = 0; i < results.rows.length; i++) {
    //for (var i in results) {
        //console.log(results.rows[i]);
        user = new User(results.rows[i].SalespersonNo, results.rows[i].SalespersonName, results.rows[i].disabled);
        users.push(user);
    }
    return users;
}

exports.findAll = findAll;
exports.findAllActive = findAllActive;
exports.find = find;
