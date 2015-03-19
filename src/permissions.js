var mysql = require('./mysql');

function resultsToPermissions(results) {
    var permission;
    var permissions = {};
    for (var i = 0; i < results.rows.length; i++) {
        var userName = results.rows[i].username;
        var userId = results.rows[i].rep;
        var email = results.rows[i].email;
        if (!permissions.hasOwnProperty(userName)) {
            permission = new Permission(userName, email);
            permissions[userName] = permission;
        }
        permissions[userName].addUserId(userId);
        //var ids = results.rows[i].split('|');
        //for (var j = 0; j < ids.length; j++) {
        //    permission = new Permission(results.rows[i].username, ids[j]);
        //    permissions.push(permission);
        //}
    }
    var permissionsArray = [];
    for (var j in permissions) {
        permissionsArray.push(permissions[j]);
    }
    return permissionsArray;
}

function Permission(userName, email, userIds) {
    this.userName = userName;
    this.email = email;
    //console.log("new Permission");
    if (typeof userIds === "undefined" || userIds === null ) {
        //console.log("setting userids to empty array");
        userIds = [];
    }
    this.userIds = userIds;
    this.getUserIds = function() {
        return this.userIds;
    }
    this.getUserName = function() {
        return this.userName;
    }
    this.getEmail = function() {
        return this.email;
    }
    var target = this;
    this.addUserId = function(userId) {
        //check if it already exists
        for (var i = 0; i < target.userIds.length; i++) {
            if (target.userIds[i] === userId) {
                return;
            }
        }
        target.userIds.push(userId);
    }
};

function find(userName, callback) {
    var params = [userName];
    var queryText = "select username, rep, email from commission_permissions where username=?";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToPermissions(results));
        },
        params
    );
}

function findAll(callback) {
    var params = [];
    var queryText = "select username, rep, email from commission_permissions";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToPermissions(results));
        },
        params
    );
}

exports.find = find;
exports.findAll = findAll;
