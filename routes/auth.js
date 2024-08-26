const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route untuk registrasi
router.post('/register', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = new User({ phone, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('Registrasi gagal');
    }
});

// Route untuk login
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Nomor telepon atau password salah');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('Login gagal');
    }
});

module.exports = router;
