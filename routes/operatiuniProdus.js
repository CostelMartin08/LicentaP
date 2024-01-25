const express = require("express");
const router = express.Router();
const db = require('./db');


function calculateTotal(cart, req) {
    total = 0;
    for (let i = 0; i < cart.length; i++) {
        //daca produsul este redus adunam pretul redus la total
        if (cart[i].reducere != 0) {
            total += (cart[i].reducere * cart[i].cantitate);
        }
        //daca pretul este cel initial (fara reducere)
        else {
            total += (cart[i].pret * cart[i].cantitate);
        }
    }
    req.session.cart = cart
    req.session.total = total;
    return total;
}

router.post('/sterge_produs', function (req, res) {

    var id = req.body.id;
    var cart = req.session.cart;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart.splice(cart.indexOf(i), 1);
        }
    }

    calculateTotal(cart, req);
    res.redirect('/cos');
});




router.post('/schimba_cantitate', function (req, res) {
    var id = req.body.id; // ID ul produsului care își schimbă cantitatea
    var plus = req.body.adauga_produs;
    var minus = req.body.remove_produs;
    var cart = req.session.cart;


    var cartProductIds = cart.map(item => item.id);
    var query = "SELECT * FROM produs WHERE id IN (" + cartProductIds.join(",") + ")";



    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Eroare la interogare' });
        } else {

            function incrementCartItem(cartItem, maxCantitate) {
                if (cartItem.cantitate < maxCantitate) {
                    cartItem.cantitate = parseInt(cartItem.cantitate) + 1;
                    return true; // Am efectuat acțiunea cu succes
                } else {

                    cartItem.stock = true;

                }
                return false; // Nu am putut efectua acțiunea
            }

            function decrementCartItem(cartItem) {
                if (cartItem.cantitate > 0) {
                    cartItem.cantitate = parseInt(cartItem.cantitate) - 1;
                    if (cartItem.cantitate === 0) {
                        return true; // Am efectuat acțiunea cu succes și elementul trebuie eliminat
                    }
                    return false; // Am efectuat doar acțiunea de decrementare
                }
                return false; // Nu am putut efectua acțiunea
            }

            let actionExecuted = false; // Variabilă pentru a urmări dacă am efectuat acțiunea

            for (let i = 0; i < cart.length; i++) {
                const cartItem = cart[i];

                if (cartItem.id == req.body.id) {
                    const correspondingDbItem = result.find(dbItem => dbItem.id == cartItem.id);

                    if (correspondingDbItem) {
                        const maxCantitate = correspondingDbItem.cantitate;

                        if (plus) {
                            if (!actionExecuted && incrementCartItem(cartItem, maxCantitate)) {
                                actionExecuted = true; // Am efectuat acțiunea, setăm variabila la true
                            }
                        } else if (minus) {
                            if (!actionExecuted && decrementCartItem(cartItem)) {
                                cart.splice(i, 1); // Elementul trebuie eliminat
                                actionExecuted = true; // Am efectuat acțiunea, setăm variabila la true
                            }
                        }
                    }
                }
            }


            // Calculul totalului pentru coș
            calculateTotal(cart, req);

            // Redirecționează către pagina Coș
            return res.redirect('/cos');
        }
    });











});


module.exports = router