const express = require("express");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Firebase Admin Setup
/*admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});*/

// Inisialisasi Aplikasi
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// **TAMBAHKAN** Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, "public")));

// Middleware untuk Auth
function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/signup");
  }
  next();
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/signup");
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/dashboard", checkAuth, (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

// API Routes
app.post("/api/verif", (req, res) => {
  res.send("User diverifikasi.");
});

app.delete("/api/dverif", (req, res) => {
  res.send("Verifikasi user dihapus.");
});

app.get("/api/saldo", (req, res) => {
  res.json({ saldo: 1000 });
});

app.post("/api/csaldo", (req, res) => {
  res.send("Saldo diubah.");
});

app.post("/api/adduser", (req, res) => {
  res.send("User baru ditambahkan.");
});

app.post("/api/login", (req, res) => {
  const { token } = req.body;
  res.cookie("token", token, { httpOnly: true });
  res.send("Login berhasil.");
});

app.post("/api/out", (req, res) => {
  res.clearCookie("token");
  res.send("Logout berhasil.");
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;
