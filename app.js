require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const MONGO_URI = "mongodb+srv://studiosdn6:EN9peFymlFsqIzgQ@cluster0.bfzkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Koneksi ke MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/wallet'));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
  
