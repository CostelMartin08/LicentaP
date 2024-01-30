const express = require("express");
const mysql = require('mysql');
const router = express.Router();
const util = require('./util');

router.get('/', function (req, res) {
  
    const total = req.session.total;
    

    if (req.isAuthenticated()) {

        const user = req.user;
        const firstName = req.user.firstName;

        res.render('pages/plaseaza_comanda', { user: user, firstName:firstName,  total: total, includeLayouts: [true] });

    } else {

        res.render('pages/login', { includeLayouts: [false] });
    }
});


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vinylshop"
});

router.post('/', function (req, res) {
    var cart = req.session.cart;
    let idProduse = "";

    for (let i = 0; i < cart.length; i++) {
        idProduse += cart[i].id + ", ";
    }

    idProduse = idProduse.slice(0, -1);

    let mapCart = cart.map(vinyl => {
        return {
            numeVinil: `Buc:(${vinyl.cantitate}) - "${vinyl.nume}"`
        };
    });

    let detaliiComanda = "";

    for (let i = 0; i < mapCart.length; i++) {
        detaliiComanda += mapCart[i].numeVinil;
        if (i < mapCart.length - 1) {
            detaliiComanda += ", ";
        }
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        let pret_final = req.body.total;
    
        let nume = req.body.nume;
        let produseComandate = cart.length;
        let email = req.body.email;
        let oras = req.body.oras;
        let adresa = req.body.adresa;
        let telefon = req.body.telefon;
        let data = util.getCurrentDateTime();

        let query = `
          INSERT INTO comenzi(pret_final, nume, email, oras, adresa, telefon, data, idProduse, produseComandate, detaliiComanda) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let values = [
            pret_final[0], nume, email, oras, adresa, telefon, data, idProduse, produseComandate, detaliiComanda
        ];

        console.log("Query:", query);

        connection.query(query, values, (queryErr, result) => {
            connection.release();

            if (queryErr) {
                console.error('Error executing query:', queryErr.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log(result);
            res.redirect('/plata');
        });
    });
});

module.exports = router