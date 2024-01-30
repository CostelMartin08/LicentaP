const express = require('express');
const app = express();
app.listen(3000);

const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const adaugaCos = require('./routes/gestionareCos');
const operatiuni = require('./routes/operatiuniProdus');
const comanda = require('./routes/plasareComanda');
const plata = require('./routes/plata');
const comenzi = require('./routes/comenzi');
const comenziUtilizator = require('./routes/comenziUtilizator');
const db = require('./routes/db');

/* -------------------------------------------------------------------------- */
require('dotenv').config();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.set('layout', './layouts/layouts.ejs');
const sessionSecret = process.env.SESSION;
app.use(session({

    secret: sessionSecret,
    resave: false,
    saveUninitialized: false

}))
app.use(passport.initialize());
app.use(passport.session());

require('./packages/passportConfig')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {

    const param = req.query.param1;

    app.locals.param = param;

    db.query("SELECT * FROM produs", (err, result) => {
        if (err) {

            console.log(err);

        } else {

            const produseActualizate = result.map(element => {
                return {
                    ...element,
                    stock: element.cantitate > 0
                };
            });


            if (req.isAuthenticated()) {
                const firstName = req.user.firstName;
                const admin = req.user.admin;
                app.locals.admin = admin
                app.locals.firstName = firstName;
                const email = req.user.email;
                app.locals.email = email;

                res.render('pages/index', { result: produseActualizate, firstName, admin, includeLayouts: [true] });
            } else {

                res.render('pages/index', { result: produseActualizate, includeLayouts: [true] });
            }
        }
    });
});



/* -------------------------------------------------------------------------- */


app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/operatiuni', operatiuni);
app.use('/cos', adaugaCos);
app.use('/plaseaza_comanda', comanda);
app.use('/plata', plata);
/* -------------------------------------------------------------------------- */
/*                             Ruta administrator                             */
/* -------------------------------------------------------------------------- */
app.use('/comenzi', comenzi);
app.use('/comenziUtilizator', comenziUtilizator);



