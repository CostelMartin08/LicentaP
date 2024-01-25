const express = require("express");
const router = express.Router();
const cookie = require('cookie');

const deleteCookie = (res, name) => {
    const deletedCookie = cookie.serialize(name, '', {
        expires: new Date(0),
        path: '/',
    });

    res.setHeader('Set-Cookie', deletedCookie);
};

router.get("/", (req, res) => {

    req.logout(err => {
        if (err) throw err;
        deleteCookie(res, 'token');
        req.app.locals.firstName = undefined
        res.redirect('/login');

    });
});

module.exports = router    