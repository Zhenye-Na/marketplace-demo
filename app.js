/* importing node module files */
var express        = require("express"),
    bodyParser     = require("body-parser"),
    flash          = require('connect-flash'),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    seedDB         = require("./seeds");


/* importing databaes */
var Product = require("./models/product"),
    User    = require("./models/user"),
    Comment = require("./models/comment");


/* importing routes */
var commentRoutes = require("./routes/comments"),
    itemRoutes    = require("./routes/items"),
    authRoutes    = require("./routes/index");


// seedDB();

/* express server configuration */
var app = express();
// mongoose.connect("mongodb://localhost:27017/marketplace", { useNewUrlParser: true });
mongoose.connect("mongodb://<dbusername>:<dbpassword>@dsXXXXXX.mlab.com:XXXXXX/XXXXXXXXX", { useNewUrlParser: true });


/* body parser configuration */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(methodOverride('_method'));
app.use(flash());


/* set the view engine to ejs */
app.set('view engine', 'ejs');

/* static pages configuration */
app.use(express.static(__dirname + '/public'));


/* passport authenticator initialization */
app.use(require("express-session")({
    secret: "Launched by Zhenye Na in Aug. 2018 in Urbana, U.S.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/items/:id/comments", commentRoutes);
app.use("/items", itemRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Everything is working fine");
    console.log("We've got a server");
});