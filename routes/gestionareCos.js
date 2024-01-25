const express = require("express");
const router = express.Router();


router.get('/', function (req, res) {

    var cart = req.session.cart;
    var total = req.session.total;

    //const param = req.app.locals.param;

    res.render('pages/cos', { cart: cart, total: total, includeLayouts: [true] });


});

function calculateTotal(cart, req) {
    total = 0;
    for (let i = 0; i < cart.length; i++) {

        if (cart[i].reducere != 0) {
            total += (cart[i].reducere * cart[i].cantitate);
        }

        else {
            total += (cart[i].pret * cart[i].cantitate);
        }
    }
    req.session.total = total;
    return total;
}


router.post('/', function (req, res) {
    var id = req.body.id;
    var artist = req.body.artist;
    var nume = req.body.nume;
    var pret = req.body.pret;
    var reducere = req.body.reducere;
    var cantitate = req.body.cantitate;
    var image = req.body.image;

    var vinyl = { id: id, artist: artist, nume: nume, pret: pret, reducere: reducere, cantitate: cantitate, image: image };

    if (req.session.cart) {
        var cart = req.session.cart;

        // Găsește produsul în coș
        var existingVinyl = cart.find(item => item.id == id);

        if (existingVinyl) {
            // Actualizează cantitatea produsului existent în coș
            existingVinyl.cantitate += parseInt(cantitate, 10);
        } else {
            // Adaugă noul produs în coș
            cart.push(vinyl);
        }
    } else {
        req.session.cart = [vinyl];
        var cart = req.session.cart;
    }

    // Calculul totalului pentru coș
    calculateTotal(cart, req);

    // Redirecționează către pagina Coș
    res.redirect('/cos');
});



module.exports = router

