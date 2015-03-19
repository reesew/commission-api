var mysql = require('mysql');

var connection;

function connect() {
    connection = mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME
        }
    );
    connection.connect();
}


function query(queryText, callback, params) {
    console.log("Running mysql query: " + queryText);
    console.log("query params: " + params);
    callback = callback;
    connect();
    if (params === null) {
        params = [];
    }
    results = connection.query(queryText, params, function(err, rows, fields){
        if (err) throw err;

        var i;
        var string = "";
        var results = {};
        //results.fields = [];
        results.rows = [];
        for (i in fields) {
            string += fields[i].name + "\t";
        }
        //console.log(string);
        for (j in rows) {
            string = "";
            results.rows[j] = {};
            for (i in fields) {
                //console.log("field:" + fields[i].name);
                //results.fields[i] = fields[i].name;
                results.rows[j][fields[i].name] = rows[j][fields[i].name];
                string += rows[j][fields[i].name] + "\t";
            }
            //console.log(string);
        }
        console.log("query results:" + results.rows.length);
        callback(results);
    });
    connection.end();
    console.log("query complete");
}

function onQuery(err, rows, fields) {
    if (err) throw err;

    var i;
    var string = "";
    for (i in fields) {
        string += fields[i].name + "\t";
    }
    console.log(string);
    for (j in rows) {
        string = "";
        for (i in fields) {
            //console.log("field:" + fields[i].name);
            string += rows[j][fields[i].name] + "\t";
        }
        //console.log(string);
    }
}



exports.query = query;
