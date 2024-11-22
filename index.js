const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Import fungsi dari file database
const { 
  tambahUser, 
  cariUser, 
  hapusUser, 
  updateSaldo, 
  viewAll, 
  cekVerif, 
  hapusVerif, 
  tambahVerif 
} = require("./function"); // Pastikan file `index.js` berada di lokasi yang sama

// Inisialisasi Aplikasi
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware untuk menyajikan file statis
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
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/dashboard", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// API Routes
app.post("/api/verif", async (req, res) => {
  const { nomer, nama, kode } = req.body;
  try {
    const result = await tambahVerif(nomer, nama, kode);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/dverif", async (req, res) => {
  const { nomer } = req.body;
  try {
    const result = await hapusVerif(nomer);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/saldo", async (req, res) => {
  const { nomer } = req.query;
  try {
    const user = await cariUser(nomer);
    res.json({ saldo: user.saldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/csaldo", async (req, res) => {
  const { nomer, saldoBaru } = req.body;
  try {
    const result = await updateSaldo(nomer, saldoBaru);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/adduser", async (req, res) => {
  const { nomer, nama, kode, saldo } = req.body;
  try {
    const result = await tambahUser(nomer, nama, kode, saldo);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", (req, res) => {
  const { token } = req.body;
  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Login berhasil" });
});

app.post("/api/out", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
});

app.get("/api/viewall", async (req, res) => {
  try {
    const allData = await viewAll();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;
  
