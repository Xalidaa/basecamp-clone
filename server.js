const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./models/index');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Session
app.use(session({
    secret: 'my_basecamp_secret_token_#932',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

const expressLayouts = require('express-ejs-layouts');

// Setup EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));

// Middleware to expose session variables to views globally
app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId, { attributes: ['id', 'username', 'is_admin'] });
        res.locals.currentUser = user ? user.get({ plain: true }) : null;
    } else {
        res.locals.currentUser = null;
    }
    next();
});

// Import Routes
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');

// Use Routes
app.use('/users', userRoutes);
app.use('/', sessionRoutes);
app.use('/projects', projectRoutes);
app.use('/admin', adminRoutes);

// Home Redirect
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/projects');
    } else {
        res.redirect('/sign_in');
    }
});

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`MyBasecamp1 server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
