'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var MysqlJson = require('mysql-json');
var mysqlJson = new MysqlJson({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

var IsConnect = false;
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});
con.connect(function (err) {
    if (err) {
        IsConnect = false;
    }
    else IsConnect = true;
});
/* GET home page. */
router.get('/', function (req, res) {

    if (!IsConnect)
        res.render('error', {
            head: "Błąd podczas łączenia z bazą danych",
            message: err.message,
            error: err
        });

    else res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/index.html");
});

router.get("/about", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/about.html");
});

router.get("/contact", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/contact.html");
});


router.post('/a', function (req, res) {
    console.log(req.body);
  
    res.send("dupa");
});


router.post('/b', urlencodedParser, function (req, res) {
    console.log(req.value);
    mysqlJson.query("SELECT * FROM food", function (err, response) {
        if (err) throw err;

        res.write("<html><head></head><body><table>");
        res.write("<tr>");
        for (var column in response[0]) {
            res.write("<td><label>" + column + "</label></td>");
        }
        res.write("</tr>");
        for (var row in response) {
            res.write("<tr>");
            for (var column in response[row]) {
                res.write("<td><label>" + response[row][column] + "</label></td>");
            }
            res.write("</tr>");
        }
        res.write("</table></body></html>");

    });
});


module.exports = router;


