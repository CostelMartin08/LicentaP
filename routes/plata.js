const express = require("express");
const router = express.Router();
const db = require('./db');


router.get('/', function (req, res) {

    var total = req.session.total;
    const cart = req.session.cart;

    if (cart & cart.length > 0) {

        req.session.cart.forEach(element => {
            const queryString = `UPDATE produs SET cantitate = cantitate - ${element.cantitate} WHERE id IN (${element.id})`;
            db.query(queryString, (err, result) => {
                if (err) {
                    console.error('Eroare la actualizarea:', err);
                } else {
                    console.log('Valoare actualizata cu succes');
                }
                console.log(result);
            });
        });


    } else {
        console.log('Nu exista nimic de actualizat!');
    }

    req.session.destroy(function (err) {
        if (err) {
            console.error('Eroare la ștergerea sesiunii:', err);
        } else {
            console.log('Sesiune stearsă cu succes');
        }
    });

    res.render('pages/plata', { total: total, includeLayouts: [true] });


});


module.exports = router
