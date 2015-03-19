var mysql = require('./mysql');

function findAll(callback) {
    var queryText = "select rep, year, threshold from commission_quotas";
    var params = [];
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToQuotas(results));
        },
        params
    );
}

function resultsToQuotas(results) {
    var quota;
    var quotas = [];
    for (var i = 0; i < results.rows.length; i++) {
        quota = new Quota(results.rows[i].rep, results.rows[i].year, results.rows[i].threshold);
        quotas.push(quota);
    }
    return quotas;
}

function Quota(userId, year, threshold) {
    this.userId = userId;
    this.year = year;
    this.threshold = threshold;
    this.getThreshold = function() {
        return this.threshold === 1;
    }
    this.getYear = function() {
        return this.year;
    }
    this.getUserId = function() {
        return this.userId;
    }
};

function find(userId, year, callback) {
    //var quota;
    //for (var i = 0; i < quotas.length; i++) {
    //    quota = quotas[i];
    //    if (quota.getId() === userId && quota.getYear() === year) {
    //        return quota.getThreshold();
    //    }
    //}
    var params = [userId, year];
    var queryText = "select rep, year, threshold from commission_quotas where rep=? and year=?";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToQuotas(results));
        },
        params
    );
}

exports.find = find;
exports.findAll = findAll;
