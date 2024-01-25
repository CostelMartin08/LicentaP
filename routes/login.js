const express = require("express");
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(cookieParser());


router.get('/', (req, res) => {

    res.render('pages/login', { includeLayouts: [false] });
 

});


router.post("/", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) return res.status(404).json({ message: "ID sau parolă greșite" });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.JWT_CODE, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                res.redirect(`/?param1=${token}`);

            });
        }
    })(req, res, next);
});




module.exports = router    