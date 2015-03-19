var mysql = require('./mysql');

function resultsToContracts(results) {
    console.log("results count: " + results.rows.length);
    var contracts = [];
    for (var i = 0; i < results.rows.length; i++) {
        row = results.rows[i];
        contract = new Contract(row);
        contracts.push(contract);
    }
    return contracts;
}


function Contract(properties) {
    for (var i in properties) {
        if (properties.hasOwnProperty(i)) {
            this[i] = properties[i];
        }
    }
};

function find(userName, callback) {
    var params = [userName];
    var queryText = "select code as userId, contract as name, startdate, enddate, percentage as rate from contractrates where code=?";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToContracts(results));
        },
        params
    );
}

function findAll(callback) {
    var params = [];
    var queryText = "select code as userId, contract as name, startdate, enddate, percentage as rate from contractrates";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToContracts(results));
        },
        params
    );
}

exports.find = find;
exports.findAll = findAll;
