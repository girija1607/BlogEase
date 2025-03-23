require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const connectDB = require('./server/config/db');
const {isActiveRoute} = require('./server/helpers/route-Helper');
const Post = require('./server/models/Post'); // Ensure correct import
const {insertPostData} = require('./server/routes/main'); // Import function

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB().then(() => {
    console.log("✅ Database connected, now inserting data...");
   // insertPostData(); // Insert posts only after MongoDB is ready
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));


// Serve static files
app.use(express.static('public'));

// Set up EJS
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.locals.isActiveRoute = isActiveRoute;

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

