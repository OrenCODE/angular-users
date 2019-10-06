const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const users = require('./routes/users');

const app = express();

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, {useNewUrlParser: true, useFindAndModify: false})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require('./config/passport')(passport);

// Port Number
const port = process.env.PORT || 8080;

// Use Routes
app.use('/api/users', users);

// index Route
app.get('/', (req,res) => {
   res.send('Invalid Endpoint');
});

app.get('*', (req,res) => {
res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(port, () => console.log(`Server running on port ${port}`));

