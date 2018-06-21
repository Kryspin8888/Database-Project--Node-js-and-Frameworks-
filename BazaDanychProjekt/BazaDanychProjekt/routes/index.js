'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
module.exports = router;

var con = require('./Database_connection.js');
con = con.connect("cheap_food_database");
exports.escape = con.escape;
var queryresponse;
var queryresponse1;

/* GET home page. */
router.get('/', function (req, res) {
    con.query("SELECT * FROM eating_place", function (err, response) {
        if (err) throw err;
        queryresponse = response;
    });
    con.query("SELECT f.id, f.name, f.price, f.amount, f.popularity, f.rating, fd.calories, fd.protein, " +
        "fd.carbohydrate, fd.fat, fd.vitamins, f.date_of_addition FROM food f LEFT JOIN food_details fd " +
        "ON fd.food_id = f.id", function (err, response) {
        if (err) throw err;
        queryresponse1 = response;
    });
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/index.html");
});
router.get("/about", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/about.html");
});

router.get("/contact", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/contact.html");
});
router.get("/food", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/food.html");
});
router.get("/login", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/login.html");
});
router.get("/restaurants", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/restaurants.html");
});
router.get("/registration", function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/registration.html");
});
router.get("/admin", function (req, res) {
    if (req.session.login && req.session.username == "admin@gmail.com")
        res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/admin.html");
    else res.send("Zaloguj się jako admin");
});
router.get('/table', function (req, res) {
    res.send(queryresponse);
});
router.get('/tablefood', function (req, res) {
    res.send(queryresponse1);
});
router.post('/sendmessage', function (req, res) {
    console.log(req.body);
    if (req.session.login)
        if (req.body.human == '5') 
        con.query("INSERT INTO contact (name,email,message,date_of_send) VALUES ( " + ifempty(req.body.name) + "," + ifempty(req.body.email) + "," +
            ifempty(req.body.message) + ",now())", function (err, response) {
                if (err) throw err;
                res.send("Wiadomość wysłana");
            });
        else res.send("Zła odpowiedź");
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/einsert', function (req, res) {
    console.log(req.body);
    if (req.session.login)
        con.query("INSERT INTO eating_place(name,city,street,cuisine,popularity,rating,date_of_addition,flat) " +
            "VALUES ( " + ifempty(req.body.ienazwa) + " , " + ifempty(req.body.imiejscowosc) + ", "
            + ifempty(req.body.iulica) + ", " + ifempty(req.body.ikuchnia) + " , " + ifemptyNumber(req.body.iepopularnosc) +
            " , " + ifemptyNumber(req.body.ieocena) + ", NOW() ," + ifempty(req.body.idom) + " )", function (err, response) {
                if (err) throw err;
                res.send("Lokal dodany");
            });
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/einsertfood', function (req, res) {
    console.log(req.body);
    if (req.session.login)
        con.query("INSERT INTO eating_place_to_food " +
            "VALUES ( " + ifemptyNumber(req.body.iidmiejsca) + " , " + ifemptyNumber(req.body.iidjedzenia) + " )", function (err, response) {
                if (err) throw err;
                res.send("Jedzenie przypisane");
            });
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/eselect', urlencodedParser, function (req, res) {
    console.log(req.body);
    con.query("SELECT id, " + whatShowlocals(req.body.d, req.body.a, req.body.b, req.body.c, req.body.e, req.body.g, req.body.h)+" date_of_addition FROM eating_place "
        + ifemptyIDfood(req.body.idjedzenia)
        + select_place(req.body.miejscowosc, req.body.ulica, req.body.enazwa, req.body.kuchnia, req.body.epopularnosc, req.body.eocena, req.body.dom, req.body.idjedzenia)
        + ifSortLocals(req.body.sort),
        function (err, response) {
        if (err) throw err;
        queryresponse = response;
    });
    res.redirect('back');
});
router.post('/finsert', function (req, res) {
    console.log(req.body);
    if (req.session.login)
        con.query("INSERT INTO food(name,price,amount,popularity,rating,date_of_addition) " +
            "VALUES ( " + ifempty(req.body.ifnazwa) + " , " + parseFloat(req.body.fcena) + ", "
            + ifempty(req.body.filosc) + ", " + ifemptyNumber(req.body.ifpopularnosc) +
            " , " + ifemptyNumber(req.body.ifocena) + ", NOW());", function (err, response) {
                if (err) throw err;
                res.send("Jedzenie dodane");
            });
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/finsertdetails', function (req, res) {
    console.log(req.body);
    console.log(req.body.idjedzenia);
    if (req.session.true)
        con.query("INSERT INTO food_details (food_id,calories,protein,carbohydrate,fat,vitamins)"
            +" VALUES ( " + ifemptyNumber(req.body.idjedzenia) + " , " + ifemptyNumber(req.body.fkalorie) + " , "
            + ifemptyFloat(req.body.fbialko) + " , " + ifemptyFloat(req.body.fweglowodany) +
            " , " + ifemptyFloat(req.body.ftluszcz) + " , " + ifempty(req.body.fwitaminy) + ")", function (err, response) {
                if (err) throw err;
                res.send("Szczegóły dodane");
            });
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/finsertlocal', function (req, res) {
    console.log(req.body);
    if (req.session.login)
        con.query("INSERT INTO eating_place_to_food " +
            "VALUES ( " + ifemptyNumber(req.body.iidmiejsca) + " , " + ifemptyNumber(req.body.iidjedzenia) + " )", function (err, response) {
                if (err) throw err;
                res.send("Lokal przypisany");
            });
    else res.send("Zaloguj się aby móc dodawać");
});
router.post('/fselect', urlencodedParser, function (req, res) {
    console.log(req.body);
    con.query("SELECT f.id, " + whatShowfood(req.body.a, req.body.b, req.body.c, req.body.d, req.body.e, req.body.f, req.body.g, req.body.h, req.body.i, req.body.j)
        +" f.date_of_addition FROM food f LEFT JOIN food_details fd ON f.id = fd.food_id " +
        ifemptyIDlocal(req.body.idmiejsca) + " WHERE f.id "
        + select_food(req.body.fnazwa, req.body.cena, req.body.ilosc, req.body.fpopularnosc, req.body.focena,
            req.body.kalorie, req.body.bialko, req.body.weglowodany, req.body.tluszcz, req.body.witaminy, req.body.idmiejsca)
        + ifSortFood(req.body.fsort),
        function (err, response) {
            if (err) throw err;
            queryresponse1 = response;
        });
    res.redirect('back');
});
router.post('/delete', function (req, res) {
    console.log(req.body);
    if(req.body.del != "szczegoly")
    con.query("DELETE FROM " + WhichTable(req.body.del) + " WHERE id = " + ifemptyNumber(req.body.id), function (err, response) {
            if (err) throw err;
            res.send("Rekord usunięty");
        });
    else con.query("DELETE FROM food_details WHERE food_id = " + ifemptyNumber(req.body.id), function (err, response) {
        if (err) throw err;
        res.send("Rekord usunięty");
    });
});
router.post('/deleterelacyjna', function (req, res) {
    console.log(req.body);
    con.query("DELETE FROM eating_place_to_food WHERE eating_place_id = " + ifemptyNumber(req.body.idl) + " AND food_id = " + ifemptyNumber(req.body.idj), function (err, response) {
        if (err) throw err;
        res.send("Rekord usunięty");
    });
});
router.post('/update', function (req, res) {
    console.log(req.body);
    con.query("UPDATE " + WhichTable(req.body.upd) + " SET "+ req.body.newvalues + " WHERE id = "+ifemptyNumber(req.body.id), function (err, response) {
        if (err) throw err;
        res.send("Rekord usunięty");
    });
});
var passwordHash = require('password-hash');
router.post('/register', function (req, res, next) {

        con.query("INSERT INTO users (email,password,date_of_create) VALUES ( "
            + ifempty(req.body.email) + " , " + ifempty(passwordHash.generate(req.body.psw))+", NOW())", function (err, results) {
                res.redirect('/login');
                if (err) throw err;
        });

});
router.post('/login', function (req, res, next) {

    con.query("SELECT * FROM users WHERE email = " + ifempty(req.body.uname), function (err, results) {

        if (results[0] && passwordHash.verify(req.body.psw, results[0].password)) {
            req.session.regenerate(function () {
                req.session.login = true;
                req.session.username = req.body.uname;
                req.session.data = results[0];
                res.send("Zalogowany");
                console.log(req.session.login);
            });

            } else {
                console.log(results[0]); // true
                res.send("Złe dane logowania");
            }
        });
});
router.get("/logout", function (req, res) {
    if (req.session.login) {
        req.session.destroy();
        res.send("Wylogowano");
    }
    else res.send("Nie byłeś zalogowany");
});
router.get('/statistick', function (req, res) {
    res.sendFile("D:/Studia/BazaDanychProjekt/BazaDanychProjekt/views/stats.html");
});
router.post('/statistic', function (req, res) {
    console.log(req.body);

    if (req.body.del == "iloscpotraw")
        PrintResult(res, "SELECT eating_place.name, eating_place.city, COUNT(eating_place_to_food.food_id) AS ilosc_potraw " +
            " FROM eating_place_to_food RIGHT JOIN eating_place ON eating_place.id = eating_place_to_food.eating_place_id " +
            " GROUP BY eating_place.name ");

    else if (req.body.del == "srednia")
        PrintResult(res, "SELECT eating_place.name,eating_place.city," +
            "AVG(IF(food.price is not null, food.price, 0)) AS cena_srednia " +
            "FROM eating_place_to_food RIGHT JOIN food ON food.id = eating_place_to_food.food_id " +
            "RIGHT JOIN eating_place on eating_place.id = eating_place_to_food.eating_place_id " +
            "GROUP BY eating_place.name;");

    else if (req.body.del == "sredniaselect")
        PrintResult(res, "select eating_place.name as Nazwa, eating_place.city as Miasto, " +
            "(select avg(if(food.price is not null, food.price, NULL)) from food, eating_place_to_food " +
            "where food.id = eating_place_to_food.food_id and eating_place.id = eating_place_to_food.eating_place_id " +
            ") as Cena_Srednia from eating_place ");
});

function ifemptyNumber(aa) {
    if (aa != "")
        return Number(aa);
    else return "NULL";
}
function ifemptyFloat(aa) {
    if (aa != "")
        return parseFloat(aa);
    else return "NULL";
}
function ifempty(aa) {
    if (aa != "")
        return con.escape(aa);
    else return "NULL";
}
function ifemptyIDlocal(aa) {
    if (aa != "")
        return " INNER JOIN eating_place_to_food etf ON etf.food_id = f.id ";
    else return "";
}
function ifemptyIDfood(aa) {
    if (aa != "")
        return " LEFT JOIN eating_place_to_food etf ON etf.eating_place_id = eating_place.id ";
    else return "";
}
function WhichTable(aa) {
    if (aa == "lokale")
        return " eating_place ";
    else if (aa == "jedzenie")
        return " food ";
    else if (aa == "kontakt")
        return " contact ";
    else if (aa == "uzytkownicy")
        return " users ";
    else return "";
}
function PrintResult(res,quer) {
    con.query(quer, function (err, response) {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write("<!doctype html><html><head><meta charset='UTF- 8'>" +
                "<script src='//ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.min.js'>" +
                "</script > <script src= '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.3/angular-route.min.js' >" +
                "</script > <script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>" +
                "<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>" +
                "<script src='//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script></head >" +
                "<body><div style='width: 80%; margin: 0 auto; padding-top: 50px'><table style='width: 98%'>");
            res.write("<tr style='background-color:#d9534f; color:white; text-align:center; padding:4px'>");
            for (var column in response[0]) {
                res.write("<td><label>" + column + "</label></td>");
            }
            res.write("</tr>");
            for (var row in response) {
                res.write("<tr style='text-indent:4px;'>");
                for (var column in response[row]) {
                    res.write("<td style='height:100%;font-weight:600;padding:4px'><label>"
                        + response[row][column] + "</label></td>");
                }
                res.write("</tr>");
            }
            res.write("</table></div></body></html>");
            res.end();
        });
}
function ifSortLocals(aa) {
    if (aa == "nazwa")
        return " ORDER BY name ";
    else if (aa == "id")
        return " ORDER BY id ";
    else if (aa == "popularnosc")
        return " ORDER BY popularity ";
    else if (aa == "ocena")
        return " ORDER BY rating ";
    else if (aa == "data")
        return " ORDER BY date_of_addition ";
    else return "";
}
function ifSortFood(aa) {
    if (aa == "nazwa")
        return " ORDER BY f.name ";
    else if (aa == "id")
        return " ORDER BY f.id ";
    else if (aa == "popularnosc")
        return " ORDER BY f.popularity ";
    else if (aa == "ocena")
        return " ORDER BY f.rating ";
    else if (aa == "cena")
        return " ORDER BY f.price ";
    else if (aa == "ilosc")
        return " ORDER BY f.amount ";
    else if (aa == "kalorie")
        return " ORDER BY fd.calories ";
    else if (aa == "bialko")
        return " ORDER BY fd.protein ";
    else if (aa == "tluszcz")
        return " ORDER BY fd.fat ";
    else if (aa == "wegle")
        return " ORDER BY fd.carbohydrate ";
    else if (aa == "data")
        return " ORDER BY f.date_of_addition ";
    else return "";
}
function whatShowlocals(aa, bb, cc, dd,ee, gg, hh) {
    var myquer = "";
    if (aa == 4)
        myquer += " name, ";
    if (bb == 1)
        myquer += " city, ";
    if (cc == 2)
        myquer += " street, ";
    if (dd == 3)
        myquer += " flat, ";
    if (ee == 5)
        myquer += " cuisine, ";
    if (gg == 7)
        myquer += " popularity, ";
    if (hh == 8)
        myquer += " rating, ";

    return myquer;
}
function whatShowfood(aa, bb, cc, dd, ee, ff ,gg ,hh ,ii ,jj) {
    var myquer = "";

    if (aa == 1)
        myquer += " f.name, ";
    if (bb == 2)
        myquer += " f.price, ";
    if (cc == 3)
        myquer += " f.amount, ";
    if (dd == 4)
        myquer += " f.popularity, ";
    if (ee == 5)
        myquer += " f.rating, ";
    if (ff == 6)
        myquer += " fd.calories, ";
    if (gg == 7)
        myquer += " fd.protein, ";
    if (hh == 8)
        myquer += " fd.carbohydrate, ";
    if (ii == 9)
        myquer += " fd.fat, ";
    if (jj == 10)
        myquer += " fd.vitamins, ";

    return myquer;
}
function select_food(aa, bb, cc, dd, ee, ff, gg, hh, ii, jj, kk) {
    var array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var quer = "";

    if (aa != "")
        array[0] = 1;
    if (bb != "")
        array[1] = 1;
    if (cc != "")
        array[2] = 1;
    if (dd != "")
        array[3] = 1;
    if (ee != "")
        array[4] = 1;
    if (ff != "")
        array[5] = 1;
    if (gg != "")
        array[6] = 1;
    if (hh != "")
        array[7] = 1;
    if (ii != "")
        array[8] = 1;
    if (jj != "")
        array[9] = 1;
    if (kk != "")
        array[10] = 1;
    
    if (array[0] == 1)
        quer += " AND f.name = " + con.escape(aa);
    if (array[1] == 1)
        quer += " AND cast(f.price as DECIMAL(5,1)) >= " + parseFloat(bb);
    if (array[2] == 1 )
        quer += " AND f.amount = " + con.escape(cc);
    if (array[3] == 1 )
        quer += " AND f.popularity >= " + Number(dd);
    if (array[4] == 1 )
        quer += " AND f.rating >= " + Number(ee);
   if (array[5] == 1 )
        quer += " AND fd.calories >= " + Number(ff);
   if (array[6] == 1 )
       quer += " AND cast(fd.protein as DECIMAL(5,1)) >= " + parseFloat(gg);
   if (array[7] == 1)
       quer += " AND cast(fd.carbohydrate as DECIMAL(5,1)) >= " + parseFloat(hh);
   if (array[8] == 1)
       quer += " AND cast(fd.fat as DECIMAL(5,1)) >= " + parseFloat(ii);
   if (array[9] == 1)
       quer += " AND fd.vitamins = " + con.escape(jj);
   if (array[10] == 1)
       quer += " AND etf.eating_place_id = " + Number(kk);

    return quer;
}

function select_place(aa, bb, cc, dd, ee, ff, gg, hh) {
    var array = [0, 0, 0, 0, 0, 0, 0, 0];
    var quer = "";
    if (aa != "")
        array[0] = 1;
    if (bb != "")
        array[1] = 1;
    if (cc != "")
        array[2] = 1;
    if (dd != "")
        array[3] = 1;
    if (ee != "")
        array[4] = 1;
    if (ff != "")
        array[5] = 1;
    if (gg != "")
        array[6] = 1;
    if (hh != "")
        array[7] = 1;

    if (array[0] == 1)
        quer += "WHERE city = " + con.escape(aa);
    if (array[1] == 1 && array[0] == 0)
        quer += "WHERE street = " + con.escape(bb);
    else if (array[1] == 1 && array[0] == 1)
        quer += " AND street = " + con.escape(bb);
    if (array[2] == 1 && array[0] == 0 && array[1] == 0)
        quer += "WHERE name = " + con.escape(cc);
    else if (array[2] == 1 && (array[0] == 1 || array[1] == 1))
        quer += " AND name = " + con.escape(cc);
    if (array[3] == 1 && array[0] == 0 && array[1] == 0 && array[2] == 0)
        quer += "WHERE cuisine = " + con.escape(dd);
    else if (array[3] == 1 && (array[0] == 1 || array[1] == 1 || array[2] == 1))
        quer += " AND cuisine = " + con.escape(dd);
    if (array[4] == 1 && array[0] == 0 && array[1] == 0 && array[2] == 0 && array[3] == 0)
        quer += "WHERE popularity >= " + Number(ee);
    else if (array[4] == 1 && (array[0] == 1 || array[1] == 1 || array[2] == 1 || array[3] == 1))
        quer += " AND popularity >= " + Number(ee);
    if (array[5] == 1 && array[0] == 0 && array[1] == 0 && array[2] == 0 && array[3] == 0 && array[4] == 0)
        quer += "WHERE rating >= " + Number(ff);
    else if (array[5] == 1 && (array[0] == 1 || array[1] == 1 || array[2] == 1 || array[3] == 1 || array[4] == 1))
        quer += " AND rating >= " + Number(ff);
    if (array[6] == 1 && array[0] == 0 && array[1] == 0 && array[2] == 0 && array[3] == 0 && array[4] == 0 && array[5] == 0)
        quer += "WHERE flat = " + con.escape(gg);
    else if (array[6] == 1 && (array[0] == 1 || array[1] == 1 || array[2] == 1 || array[3] == 1 || array[4] == 1 || array[5] == 1))
        quer += " AND flat = " + con.escape(gg);
    if (array[7] == 1 && array[0] == 0 && array[1] == 0 && array[2] == 0 && array[3] == 0 && array[4] == 0 && array[5] == 0 && array[6] == 0)
        quer += " WHERE etf.food_id = " + Number(hh);
    else if (array[7] == 1 && (array[0] == 1 || array[1] == 1 || array[2] == 1 || array[3] == 1 || array[4] == 1 || array[5] == 1 || array[6] == 1))
        quer += " AND etf.food_id = " + Number(hh);

    return quer;
}
