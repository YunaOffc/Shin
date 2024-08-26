const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware untuk otentikasi
function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch {
        res.redirect('/login');
    }
}

// Route dashboard
router.get('/dashboard', auth, async (req, res) => {
    const user = await User.findById(req.userId);
    res.render('dashboard', { user });
});

// Route untuk transfer saldo
router.post('/transfer', auth, async (req, res) => {
    const { phone, amount } = req.body;
    try {
        const recipient = await User.findOne({ phone });
        if (!recipient || recipient._id.equals(req.userId)) {
            return res.status(400).send('Transfer gagal');
        }

        const sender = await User.findById(req.userId);
        if (sender.balance < amount) {
            return res.status(400).send('Saldo tidak mencukupi');
        }

        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('Transfer gagal');
    }
});

module.exports = router;
