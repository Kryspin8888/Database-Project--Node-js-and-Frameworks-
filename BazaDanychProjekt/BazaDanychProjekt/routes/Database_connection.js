
exports.connect = function (database_name) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: database_name
    });
    con.connect(function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Połaczono z baza danych");
    });
    return con;
}