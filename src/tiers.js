var mysql = require('./mysql');

function resultsToTiers(results) {
    console.log("results count: " + results.rows.length);
    var tiers = [];
    for (var i = 0; i < results.rows.length; i++) {
        row = results.rows[i];
        tier = new Tier(row);
        tiers.push(tier);
    }
    return tiers;
}


function Tier(properties) {
    for (var i in properties) {
        if (properties.hasOwnProperty(i)) {
            this[i] = properties[i];
        }
    }
};

function find(userName, callback) {
    var params = [userName];
    var queryText = "select rep as userId, tier2start, tier3start, tier4start, tier1, tier2, tier3, tier4, startdate, enddate, accessory_commission from commission_tiers where rep=?";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToTiers(results));
        },
        params
    );
}

function findAll(callback) {
    var params = [];
    var queryText = "select rep as userId, tier2start, tier3start, tier4start, tier1, tier2, tier3, tier4, startdate, enddate, accessory_commission from commission_tiers";
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToTiers(results));
        },
        params
    );
}

exports.find = find;
exports.findAll = findAll;
