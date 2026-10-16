const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newRoutes = require('./routes/newRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newRoutes);

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;